import Promotion, { IPromotion } from "../models/Promotion";

export interface PromotionLineItem {
  productId: string;
  category?: string;
  price: number;
  quantity: number;
}

export interface PromotionResult {
  promotion: IPromotion;
  code: string;
  discount: number;
  eligibleSubtotal: number;
}

export class PromotionError extends Error {
  code: "NOT_FOUND" | "INACTIVE" | "NOT_APPLICABLE" | "USAGE_LIMIT";

  constructor(code: PromotionError["code"], message: string) {
    super(message);
    this.name = "PromotionError";
    this.code = code;
  }
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function getEligibleSubtotal(promotion: IPromotion, items: PromotionLineItem[]): number {
  const hasProductRules = promotion.productIds.length > 0;
  const hasCategoryRules = promotion.categories.length > 0;

  return items.reduce((sum, item) => {
    const eligible =
      (!hasProductRules && !hasCategoryRules) ||
      (hasProductRules && promotion.productIds.includes(item.productId)) ||
      (hasCategoryRules && !!item.category && promotion.categories.includes(item.category));

    return eligible ? sum + item.price * item.quantity : sum;
  }, 0);
}

export async function validatePromotion(
  code: string,
  items: PromotionLineItem[],
  subtotal: number
): Promise<PromotionResult> {
  const normalizedCode = code.trim().toUpperCase();
  const promotion = await Promotion.findOne({ code: normalizedCode });

  if (!promotion) {
    throw new PromotionError("NOT_FOUND", "Promotion code not found");
  }

  const now = new Date();
  if (
    !promotion.active ||
    (promotion.startsAt && promotion.startsAt > now) ||
    (promotion.endsAt && promotion.endsAt <= now)
  ) {
    throw new PromotionError("INACTIVE", "This promotion is not currently active");
  }

  if (promotion.usageLimit !== undefined && promotion.usageCount >= promotion.usageLimit) {
    throw new PromotionError("USAGE_LIMIT", "This promotion has reached its usage limit");
  }

  const eligibleSubtotal = roundCurrency(getEligibleSubtotal(promotion, items));
  if (eligibleSubtotal <= 0) {
    throw new PromotionError("NOT_APPLICABLE", "This promotion does not apply to the items in your cart");
  }

  const discount = roundCurrency(
    promotion.type === "percentage"
      ? eligibleSubtotal * (promotion.value / 100)
      : Math.min(promotion.value, eligibleSubtotal)
  );

  return {
    promotion,
    code: normalizedCode,
    discount: Math.min(discount, Math.max(0, roundCurrency(subtotal))),
    eligibleSubtotal,
  };
}

export async function reservePromotionUsage(code: string): Promise<void> {
  const now = new Date();
  const promotion = await Promotion.findOneAndUpdate(
    {
      code,
      active: true,
      $and: [
        {
          $or: [
            { startsAt: { $exists: false } },
            { startsAt: { $lte: now } },
          ],
        },
        {
          $or: [
            { endsAt: { $exists: false } },
            { endsAt: { $gt: now } },
          ],
        },
        {
          $or: [
            { usageLimit: { $exists: false } },
            { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
          ],
        },
      ],
    },
    { $inc: { usageCount: 1 } },
    { new: true }
  );

  if (!promotion) {
    throw new PromotionError("USAGE_LIMIT", "This promotion is no longer available");
  }
}

export async function restorePromotionUsage(code: string): Promise<void> {
  await Promotion.updateOne(
    { code, usageCount: { $gt: 0 } },
    { $inc: { usageCount: -1 } }
  );
}
