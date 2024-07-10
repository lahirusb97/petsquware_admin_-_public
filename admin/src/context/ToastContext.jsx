import React, { createContext, useState, useContext, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CircularProgress, Typography } from "@mui/material";
import { Error, MarkChatRead } from "@mui/icons-material";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          <Typography margin={"0 4px"} variant="body1">
            {toast.message}
          </Typography>
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
