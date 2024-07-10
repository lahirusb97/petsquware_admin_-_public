// Login.js
import React, { useState } from "react";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { auth } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("petssquaretoys@gmail.com");
  const [password, setPassword] = useState("pets1234");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Logged in user:", user);
      navigate("/", { replace: true });
    } catch (error) {
      setError("Failed to sign in. Please check your email and password.");
      console.error("Error signing in with password and email", error);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
