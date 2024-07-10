import React from "react";
import { Box } from "@mui/material";
import { Drawer } from "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  ProductionQuantityLimitsTwoTone,
  Close,
  Add,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
export default function Nav() {
  let location = useLocation();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const closeNav = () => {
    setOpen(false);
  };

  const navLinkNormal = [
    {
      name: "Dashboard",
      navIcon: <Dashboard />,
      navPath: "/",
    },
    {
      name: "Product",
      navIcon: <ProductionQuantityLimitsTwoTone />,
      navPath: "/product",
    },
    {
      name: "Add Product",
      navIcon: <Add />,
      navPath: "/add_product",
    },
  ];

  return (
    <div>
      <IconButton color="primary" onClick={toggleDrawer}>
        <MenuIcon size={24} />
      </IconButton>
      <React.Fragment>
        <Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
          <Box
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
            width={250}
          >
            <div className="flex justify-end">
              <IconButton color="primary" onClick={closeNav}>
                <Close />
              </IconButton>
            </div>
            <List>
              {navLinkNormal.map((e) => (
                <ListItem key={e.name} disablePadding>
                  <Link to={e.navPath} style={{ textDecoration: "none" }}>
                    <ListItemButton
                      sx={{
                        width: 250,
                        backgroundColor:
                          location.pathname === e.navPath ? "black" : "inherit",
                        color:
                          location.pathname === e.navPath ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor:
                            location.pathname === e.navPath
                              ? "black"
                              : "inherit",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            location.pathname === e.navPath
                              ? "white"
                              : "inherit",
                        }}
                      >
                        {e.navIcon}
                      </ListItemIcon>
                      <ListItemText primary={e.name} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
