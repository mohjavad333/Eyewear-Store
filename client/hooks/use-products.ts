import { useEffect, useState } from "react";

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  brand?: string;
  material?: string;
  color?: string;
  gender?: string;
  lensType?: string;
  frameSize?: string;
  isNew?: boolean;
  discount?: number;
  stock?: number;
  inStock?: boolean;
}

interface ProductApiRecord extends Omit<CatalogProduct, "id"> {
  productId: string;
}

function normalizeProduct(product: ProductApiRecord): CatalogProduct {
  return {
    ...product,
    id: product.productId,
    discount:
      product.discount ??
      (product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : undefined),
  };
}

export function useProducts(fallback: CatalogProduct[]) {
  const [products, setProducts] = useState<CatalogProduct[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Product catalog unavailable");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.products)) {
          setProducts(data.products.map(normalizeProduct));
        }
      })
      .catch(() => {
        if (active) setProducts(fallback);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fallback]);

  return { products, loading };
}
