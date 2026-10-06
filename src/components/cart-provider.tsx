"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type Item = { productId: string; quantity: number };
type Cart = { items: Item[]; ready: boolean; setItems: (items: Item[]) => void; submissionKey: string; clear: () => void };
const Context = createContext<Cart | null>(null);
export function CartProvider({ userId, children }: { userId?: string; children: ReactNode }) {
  const storageKey = `ajs-cart:${userId ?? "guest"}`;
  const [items, setItemsState] = useState<Item[]>([]);
  const [submissionKey, setSubmissionKey] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (stored && Array.isArray(stored.items)) {
        setItemsState(stored.items.filter((i: Item) => typeof i.productId === "string" && Number.isSafeInteger(i.quantity) && i.quantity > 0));
        setSubmissionKey(typeof stored.submissionKey === "string" ? stored.submissionKey : crypto.randomUUID());
      } else { setItemsState([]); setSubmissionKey(crypto.randomUUID()); }
    } catch { setItemsState([]); setSubmissionKey(crypto.randomUUID()); }
    setReady(true);
  }, [storageKey]);
  function persist(next: Item[], key: string) {
    setItemsState(next); setSubmissionKey(key);
    try { localStorage.setItem(storageKey, JSON.stringify({ items: next, submissionKey: key })); } catch { /* The cart stays usable in memory when browser storage is disabled. */ }
  }
  return <Context.Provider value={{ items, ready, submissionKey, setItems: next => persist(next, crypto.randomUUID()), clear: () => persist([], crypto.randomUUID()) }}>{children}</Context.Provider>;
}
export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error("CartProvider missing");
  return value;
}
