import React from "react";
import AuthContext from "@/context/auth.context";
import { useCheckAuthenticity } from "@/hooks/use-authContext-logic";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const contextValue = useCheckAuthenticity();
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
