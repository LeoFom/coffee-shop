"use client";

import {
  createContext,
  useState,
} from "react";
import type { User } from "@/lib/auth/user";

export type { User };

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
};

export const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
                               children,
                               initialUser,
                             }: {
  children: React.ReactNode;
  initialUser: User | null;
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
