import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems from cookies if available
  const initialCartItems = Cookies.get("cartItems")
    ? JSON.parse(Cookies.get("cartItems"))
    : [];
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    // Increment the tab count
    const tabCount = parseInt(sessionStorage.getItem("tabCount")) || 0;
    sessionStorage.setItem("tabCount", tabCount + 1);

    const handleBeforeUnload = () => {
      // Decrement the tab count
      const currentTabCount = parseInt(sessionStorage.getItem("tabCount")) || 1;
      sessionStorage.setItem("tabCount", currentTabCount - 1);

      // If no tabs remain, clear the cart items
      if (currentTabCount - 1 === 0) {
        Cookies.remove("cartItems");
        localStorage.removeItem("cartItems"); // Remove from localStorage too
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Ensure tab count is decremented if tab is closed without triggering beforeunload
      handleBeforeUnload();
    };
  }, []);

  useEffect(() => {
    // Update cookies and localStorage whenever cartItems change
    Cookies.set("cartItems", JSON.stringify(cartItems), { expires: 1 });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const syncCartItems = (event) => {
      if (event.key === "cartItems") {
        setCartItems(JSON.parse(event.newValue) || []);
      }
    };

    window.addEventListener("storage", syncCartItems);

    return () => {
      window.removeEventListener("storage", syncCartItems);
    };
  }, []);

  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (
        itemIndex !== -1 &&
        item["qty"] <= prevItems[itemIndex].userSelectQty
      ) {
        // Item found, increment its quantity
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].userSelectQty += 1;
        return updatedItems;
      } else {
        // Item not found, add new item with quantity 1
        return [...prevItems, { ...item, userSelectQty: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const incrementQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        openCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};
