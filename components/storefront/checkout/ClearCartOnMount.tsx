"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Renders nothing — just clears the cart once the success page has mounted. */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}