// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
