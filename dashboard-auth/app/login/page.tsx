"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/Login";
import { isAuthEnabled } from "@/lib/auth";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthEnabled()) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return <LoginPage />;
};

export default Login;
