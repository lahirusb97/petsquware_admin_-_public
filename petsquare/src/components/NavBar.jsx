import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Drawer,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const pages = ["cat", "dog", "contacts"];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
    // Close the drawer after search is initiated

    // Implement your search logic here
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img className="w-16 h-16" src="logo.png" alt="logo" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Petsquare
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleDrawerToggle}
                onKeyDown={handleDrawerToggle}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Menu
                  </Typography>
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleDrawerToggle}>
                      <Typography
                        textAlign="center"
                        component={Link}
                        to={`/${page.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Box>
                <Box sx={{ p: 2 }}>
                  <TextField
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search…"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      style: { color: "black" },
                    }}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "black",
                      },
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                      mt: 1,
                      color: "black",
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "white" },
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <Link to={`/`} style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
            </Button>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={`/${page.toLowerCase()}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
