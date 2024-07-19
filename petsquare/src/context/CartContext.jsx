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
    const findItemExists = cartItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (findItemExists) {
      const newQty = findItemExists.userSelectQty + item.userSelectQty;
      if (newQty <= item.qty) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, userSelectQty: newQty }
              : cartItem
          )
        );
      } else {
        console.log("Quantity exceeds available stock.");
      }
    } else {
      if (item.userSelectQty <= item.qty) {
        setCartItems([
          ...cartItems,
          { ...item, userSelectQty: item.userSelectQty },
        ]);
      } else {
        console.log("Quantity exceeds available stock.");
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const incrementQuantity = (itemId) => {
    const findItemExists = cartItems.filter(
      (cartItem) => cartItem.id === itemId
    );
    if (findItemExists[0].userSelectQty < findItemExists[0]["qty"]) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, userSelectQty: cartItem.userSelectQty + 1 }
            : cartItem
        )
      );
    }
  };

  const decrementQuantity = (itemId) => {
    const findItemExists = cartItems.filter(
      (cartItem) => cartItem.id === itemId
    );
    if (
      findItemExists[0].userSelectQty <= findItemExists[0]["qty"] &&
      findItemExists[0].userSelectQty > 1
    ) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, userSelectQty: cartItem.userSelectQty - 1 }
            : cartItem
        )
      );
    }
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
