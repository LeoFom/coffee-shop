"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch(`http://localhost:3000/api/auth/logout`, {
        method: 'POST',
      });

      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}