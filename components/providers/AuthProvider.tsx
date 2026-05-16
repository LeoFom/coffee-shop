"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
                               children,
                               initialUser,
                             }: {
  children: React.ReactNode;
  initialUser: User;
}) {

  const [user, setUser] =
    useState<User | null>(initialUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth error");
  }

  return context;
}