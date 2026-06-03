import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getUser() {

  const cookieStore =
    await cookies()

  const res = await fetch(
    `${BASE_URL}/api/auth/me`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },

      cache: 'no-store',
    }
  )

  if (!res.ok) {
    return null
  }

  return res.json()
}