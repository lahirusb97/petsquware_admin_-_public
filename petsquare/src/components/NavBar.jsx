import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { MenuItem, Drawer, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const pages = ["cat", "dog", "contacts"];

function NavBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
    setDrawerOpen(false);
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
              <Box sx={{ width: 250 }} role="presentation">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Menu
                  </Typography>
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={handleDrawerToggle}
                      component={Link}
                      to={`/${page.toLowerCase()}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page}
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
            <Link to={`/`} style={{ color: "white", textDecoration: "none" }}>
              <Button
                onClick={handleDrawerToggle}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Home
              </Button>
            </Link>
            {pages.map((page) => (
              <Link
                to={`/${page.toLowerCase()}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                <Button
                  key={page}
                  onClick={handleDrawerToggle}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 2,
            }}
          >
            <TextField
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search…"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { color: "white" },
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
                ml: 1,
                color: "black",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              Search
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
