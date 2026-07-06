"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type NewCartItem = Omit<CartItem, "quantity">;

const STORAGE_KEY = "cart";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: NewCartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved cart once, after mount (localStorage doesn't exist during SSR)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupted/inaccessible storage — start empty rather than crashing
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change — but only once hydration has finished,
  // otherwise this fires first with an empty array and wipes the saved cart.
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  function addItem(newItem: NewCartItem, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.id === newItem.id);
      if (existing) {
        return current.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { ...newItem, quantity }];
    });

    // Auto-open the drawer on add — this is what actually lets you "see"
    // that add-to-cart worked without wiring a separate cart icon first.
    setIsOpen(true);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  // Delta-based, matching how CartSlider calls it: updateQuantity(id, -1) / (id, 1)
  function updateQuantity(id: string, delta: number) {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0) // drop to 0 = remove, not negative quantity
    );
  }

  function clearCart() {
    setItems([]);
  }

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function toggleCart() {
    setIsOpen((prev) => !prev);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}