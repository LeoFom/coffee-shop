import { nodejsFetch } from "@/lib/nodejs/fetcher";
import type { User } from "@/lib/auth/user";
import { parseUserRole } from "@/lib/auth/user";

export async function getUser(): Promise<User | null> {
  const res = await nodejsFetch('/auth/me');

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (typeof data?.id !== "string" || typeof data?.email !== "string") {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: parseUserRole(data.role),
  };
}
