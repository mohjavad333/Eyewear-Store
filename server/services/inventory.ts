import Inventory from "../models/Inventory";

const defaultInventory = [
  { productId: "1", stock: 15 },
  { productId: "2", stock: 22 },
  { productId: "3", stock: 8 },
  { productId: "4", stock: 3 },
  { productId: "5", stock: 2 },
  { productId: "6", stock: 15 },
  { productId: "7", stock: 6 },
  { productId: "8", stock: 4 },
  { productId: "9", stock: 7 },
  { productId: "10", stock: 10 },
  { productId: "11", stock: 3 },
  { productId: "12", stock: 9 },
];

export interface InventoryItemRequest {
  productId: string;
  quantity: number;
}

export async function initializeInventory(): Promise<void> {
  await Promise.all(
    defaultInventory.map(({ productId, stock }) =>
      Inventory.updateOne(
        { productId },
        { $setOnInsert: { productId, stock } },
        { upsert: true }
      )
    )
  );
}

export class InventoryError extends Error {
  code: "PRODUCT_NOT_FOUND" | "INSUFFICIENT_STOCK";
  available: number;

  constructor(
    code: "PRODUCT_NOT_FOUND" | "INSUFFICIENT_STOCK",
    productId: string,
    available = 0
  ) {
    super(
      code === "PRODUCT_NOT_FOUND"
        ? `Product ${productId} is not available`
        : `Only ${available} unit${available === 1 ? "" : "s"} of product ${productId} remain`
    );
    this.name = "InventoryError";
    this.code = code;
    this.available = available;
  }
}

export async function validateCartInventory(items: InventoryItemRequest[]): Promise<void> {
  const requested = new Map<string, number>();

  for (const item of items) {
    requested.set(item.productId, (requested.get(item.productId) || 0) + item.quantity);
  }

  const inventories = await Inventory.find({ productId: { $in: [...requested.keys()] } }).lean();
  const stockByProduct = new Map(inventories.map((inventory) => [inventory.productId, inventory.stock]));

  for (const [productId, quantity] of requested) {
    const available = stockByProduct.get(productId);

    if (available === undefined) {
      throw new InventoryError("PRODUCT_NOT_FOUND", productId);
    }

    if (available < quantity) {
      throw new InventoryError("INSUFFICIENT_STOCK", productId, available);
    }
  }
}

export async function decrementInventory(items: InventoryItemRequest[]): Promise<void> {
  const requested = new Map<string, number>();

  for (const item of items) {
    requested.set(item.productId, (requested.get(item.productId) || 0) + item.quantity);
  }

  const decremented: InventoryItemRequest[] = [];

  try {
    for (const [productId, quantity] of requested) {
      const inventory = await Inventory.findOneAndUpdate(
        {
          productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { new: true }
      );

      if (!inventory) {
        const current = await Inventory.findOne({ productId }).lean();
        if (!current) {
          throw new InventoryError("PRODUCT_NOT_FOUND", productId);
        }
        throw new InventoryError("INSUFFICIENT_STOCK", productId, current.stock);
      }

      decremented.push({ productId, quantity });
    }
  } catch (error) {
    if (decremented.length > 0) {
      await Promise.all(
        decremented.map(({ productId, quantity }) =>
          Inventory.updateOne({ productId }, { $inc: { stock: quantity } })
        )
      );
    }
    throw error;
  }
}

export async function restoreInventory(items: InventoryItemRequest[]): Promise<void> {
  const requested = new Map<string, number>();

  for (const item of items) {
    requested.set(item.productId, (requested.get(item.productId) || 0) + item.quantity);
  }

  await Promise.all(
    [...requested].map(([productId, quantity]) =>
      Inventory.updateOne({ productId }, { $inc: { stock: quantity } })
    )
  );
}
