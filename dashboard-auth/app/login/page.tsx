"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/Login";
import { isAuthEnabled } from "@/lib/auth";
import { isAuthenticated } from "@/lib/tokenUtils";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthEnabled() && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return <LoginPage />;
};

export default Login;
