"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {nodejsFetch} from "@/lib/nodejs/fetcher";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      // Вызываем логаут на бэкенде, чтобы он удалил куку (reply.clearCookie)
      await nodejsFetch('/api/auth/logout', { method: 'POST' });

      // Очищаем локальное состояние (если есть) и редиректим
      router.push("/auth/login");
      router.refresh(); // Важно, чтобы серверные компоненты обновились
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}