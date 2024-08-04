import Navbar from "@/components/layout/Navbar";
import { ROUTE_SIGN_IN } from "@/lib/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect(ROUTE_SIGN_IN);
  }

  return <Navbar>{children}</Navbar>;
};
