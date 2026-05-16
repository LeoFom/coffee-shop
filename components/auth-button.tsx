import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const user = {
    email: '',
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Привет, {user?.email || ''}!</span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}