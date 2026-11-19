"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "@/components/providers/AuthProvider";
import { setIsAuthenticated } from "@/store/auth/authSlice";

export function LogoutButton() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      auth?.setUser(null);
      dispatch(setIsAuthenticated(false));
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}
