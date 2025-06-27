import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type UserTypeContextType = {
  userType: string[];
  setUserType: (userType: string[]) => void;
};

const UserTypeContext = createContext<UserTypeContextType | undefined>(
  undefined
);

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }
  return context;
};

interface UserTypeProviderProps {
  children: ReactNode;
}

export const UserTypeProvider: React.FC<UserTypeProviderProps> = ({
  children,
}) => {
  const [userType, setUserType] = useState<string[]>(["COLABORADOR"]);

  useEffect(() => {
    // Simular carregamento do tipo de usuário
    setTimeout(() => {
      setUserType(["GESTOR", "RH", "COMITE"]);
    }, 500);
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
