"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSwell, type SwellCart } from "@/lib/swell-client";

type CartContextValue = {
  count: number;
  adding: string | null;
  addItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue>({
  count: 0,
  adding: null,
  addItem: async () => {},
  refresh: async () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const [adding, setAdding] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const cart = (await getSwell().cart.get()) as unknown as SwellCart | null;
      setCount(cart?.item_quantity ?? 0);
    } catch {
      // Cart service unreachable; keep whatever count we had.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cart = (await getSwell().cart.get()) as unknown as SwellCart | null;
        if (!cancelled) setCount(cart?.item_quantity ?? 0);
      } catch {
        // Cart service unreachable on load; badge stays at 0.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(async (productId: string) => {
    setAdding(productId);
    try {
      const cart = (await getSwell().cart.addItem({
        product_id: productId,
        quantity: 1,
      })) as unknown as SwellCart | null;
      setCount(cart?.item_quantity ?? 0);
    } finally {
      setAdding(null);
    }
  }, []);

  return (
    <CartContext.Provider value={{ count, adding, addItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
