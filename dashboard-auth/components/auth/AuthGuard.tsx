"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthEnabled } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthEnabled()) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);

  return <>{children}</>;
}