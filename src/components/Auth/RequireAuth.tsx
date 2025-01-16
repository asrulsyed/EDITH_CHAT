import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = (composedComponent: React.ReactNode) => {
  const Authentication = () => {
    const { logined } = useAuth();

    return logined ? <Navigate to="/chat" /> : composedComponent;
  };
  return <Authentication />
};

const TokenVerify = (composedComponent: React.ReactNode) => {
  const Authentication = () => {
    const { logined } = useAuth();

    return logined ? composedComponent : <Navigate to="/auth/login" />;
  };
  return <Authentication />
};

export { AuthGuard, TokenVerify };
