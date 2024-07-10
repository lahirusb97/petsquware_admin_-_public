import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductView from "./pages/ProductView";

import { Fab } from "@mui/material";
import CartDrawer from "./components/CartDrawer";
import { CategoryRounded } from "@mui/icons-material";
import { useCartContext } from "./context/CartContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useEffect } from "react";
import CatCategory from "./pages/CatCategory";

function App() {
  const { toggleCart } = useCartContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <div>error</div>,
    },
    {
      path: "/:product",
      element: <ProductView />,
      errorElement: <div>error</div>,
    },
    {
      path: "/cat",
      element: <CatCategory />,
      errorElement: <div>error</div>,
    },
    {
      path: "/dog",
      element: <Category />,
      errorElement: <div>error</div>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
      <CartDrawer />
      <div className="fixed bottom-4 right-4 z-10">
        <Fab
          onClick={toggleCart}
          size="small"
          color="secondary"
          aria-label="add"
        >
          <CategoryRounded />
        </Fab>
      </div>
    </div>
  );
}

export default App;
