import React from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#7A4AEA", color: "white", py: "4rem" }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Company Info */}
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Pets Square
          </Typography>
          <Typography variant="body1" mb={2}>
            Connecting pets and people.
          </Typography>
          {/* Mailing List Form */}
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Quick Links
          </Typography>
          <Typography variant="body2" mb={1}>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Blog
            </a>
          </Typography>
          <Typography variant="body2" mb={1}>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Stock list
            </a>
          </Typography>
        </Grid>

        {/* Customer Care */}
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Customer Care
          </Typography>
          <Typography variant="body2" mb={1}>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Contact us
            </a>
          </Typography>
          <Typography variant="body2" mb={1}>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              FAQs
            </a>
          </Typography>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Follow Us
          </Typography>
          <Box display="flex" justifyContent="center">
            <Facebook sx={{ fontSize: 30, mx: 1 }} />
            <Instagram sx={{ fontSize: 30, mx: 1 }} />
            <WhatsApp sx={{ fontSize: 30, mx: 1 }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
