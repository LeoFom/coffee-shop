import {getUser} from "@/lib/auth/getUser";
import {redirect} from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login')
  }
  return (
    <main className="min-h-screen flex flex-col items-center">
      {children}
    </main>
  );
}
