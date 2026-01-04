import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn("useCart must be used within a CartProvider");
    return {
      cart: [],
      addToCart: () => {},
      removeItem: () => {},
      clearCart: () => {},
      getTotal: () => 0,
      getItemCount: () => 0
    };
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (kit, size) => {
    if (!kit || !size) return;
    
    const newItem = {
      ...kit,
      size,
      cartId: Date.now(),
      // Ensure price is a number
      price: Number(kit.price) || 0
    };
    setCart(prev => [...prev, newItem]);
    return newItem;
  };

  const removeItem = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // FIXED: Properly calculate total
  const getTotal = () => {
    if (!cart || cart.length === 0) return 0;
    
    const total = cart.reduce((sum, item) => {
      // Ensure item.price is a number
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);
    
    return parseFloat(total.toFixed(2)); // Round to 2 decimal places
  };

  const getItemCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeItem,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}