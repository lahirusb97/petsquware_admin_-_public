import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCartContext } from "../context/CartContext";

export default function CartDrawer() {
  const {
    openCart,
    toggleCart,
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCartContext();

  const drawerWidth = 300; // Set the width of the drawer
  const imageSize = 100; // Set the size of the image square (in pixels)

  // Calculate total price of items in cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.userSelectQty,
    0
  );

  return (
    <Drawer anchor="right" open={openCart} onClose={toggleCart}>
      <Box
        sx={{ width: drawerWidth, paddingTop: "20px", paddingLeft: "10px" }}
        role="presentation"
        onClick={toggleCart}
        onKeyDown={toggleCart}
      >
        <List>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <IconButton
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "0 ",
                      color: "red",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <img
                    src={item.images[0]} // Assuming item.images[0] contains the image URL
                    alt={item.name}
                    style={{
                      width: `${imageSize}px`,
                      height: `${imageSize}px`,
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />

                  <ListItemText
                    primary={item.name}
                    secondary={`$${(item.price * item.userSelectQty).toFixed(
                      2
                    )} - Quantity: ${item.userSelectQty}`} // Displaying dynamically calculated total price based on quantity
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementQuantity(item.id);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementQuantity(item.id);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </ListItem>
                {index !== cartItems.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Cart is empty" />
            </ListItem>
          )}
        </List>

        <Box mt={2}>
          <Divider />
          <Box mt={2} position={"absolute"} bottom={10} textAlign="center">
            <ListItemText primary={`Total Price: $${totalPrice.toFixed(2)}`} />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
