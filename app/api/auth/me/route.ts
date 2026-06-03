import {nodejsFetch} from "@/lib/nodejs/fetcher";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const res = await nodejsFetch('/auth/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}