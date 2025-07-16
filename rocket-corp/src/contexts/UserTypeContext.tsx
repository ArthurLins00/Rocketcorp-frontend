import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type UserTypeContextType = {
  userType: string[];
  setUserType: (userType: string[]) => void;
  user: any | null;
  setUser: (user: any | null) => void;
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
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Load user info and roles from localStorage if available
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setUser(userObj);
        if (userObj && userObj.role) {
          setUserType(userObj.role);
        }
      } catch {}
    }
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, user, setUser }}>
      {children}
    </UserTypeContext.Provider>
  );
};
