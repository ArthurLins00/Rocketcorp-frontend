import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string[];
  [key: string]: unknown;
}

type UserTypeContextType = {
  userType: string[];
  setUserType: (userType: string[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUserData: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  const loadUserFromStorage = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr) as User;
        setUser(userObj);
        if (userObj && userObj.role) {
          setUserType(userObj.role);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    } else {
      setUser(null);
      setUserType(["COLABORADOR"]);
    }
  };

  const refreshUserData = () => {
    loadUserFromStorage();
  };

  // Load user info and roles from localStorage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Listen for storage events (when localStorage changes in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        loadUserFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, user, setUser, refreshUserData }}>
      {children}
    </UserTypeContext.Provider>
  );
};
