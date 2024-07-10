import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "@stripe/stripe-js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </React.StrictMode>
);
