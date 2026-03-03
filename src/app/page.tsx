import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  } else if (session?.user?.role === "EMPLOYEE") {
    redirect("/employee");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Employee Management System</h1>
      <p className="text-lg text-muted-foreground mb-8">Authenticate to access your dashboard.</p>
      <Link href="/login">
        <Button size="lg">Go to Login</Button>
      </Link>
    </div>
  );
}
