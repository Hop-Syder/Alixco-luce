import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);
const STORAGE_KEY = "alix_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1, notes = "") => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id && i.notes === notes);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || null,
        quantity,
        notes: notes || "",
      }];
    });
    toast.success("Ajouté au panier", { description: product.name });
  }, []);

  const updateQuantity = useCallback((idx, qty) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, qty) } : it));
  }, []);

  const updateNotes = useCallback((idx, notes) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, notes } : it));
  }, []);

  const removeItem = useCallback((idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, updateNotes, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
