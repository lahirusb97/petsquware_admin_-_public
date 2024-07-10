import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import { Dashboard } from "@mui/icons-material";
import DashboardHome from "./pages/DashboardHome";
import Product from "./pages/Product";
import { ProductProvider } from "./context/ProductContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import AdminProtected from "./AdminProtected";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
function App() {
  const router = createBrowserRouter([
    {
      element: <AdminProtected />,
      children: [
        {
          path: "/",
          element: (
            <div>
              <Nav />
              <DashboardHome />
            </div>
          ),
        },
        {
          path: "/product",
          element: (
            <div>
              <Nav />
              <Product />
            </div>
          ),
          errorElement: <div>error</div>,
        },
        {
          path: "/add_product",
          element: (
            <div className="m-auto">
              <Nav />
              <AddProduct />
            </div>
          ),
          errorElement: <div>error</div>,
        },
        {
          path: "/product_update/:product",
          element: (
            <div>
              <Nav />
              <UpdateProduct />
            </div>
          ),
          errorElement: <div>error</div>,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
      errorElement: <div>error</div>,
    },
  ]);
  return (
    <AuthProvider>
      <ToastProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
