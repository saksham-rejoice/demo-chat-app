"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashBoardPage from "@/components/dashboard";
import { isAuthEnabled } from "@/lib/auth";
import { isAuthenticated } from "@/lib/tokenUtils";

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isAuthEnabled() && !isAuthenticated()) {
      router.push("/login");
    }
  }, [router, isClient]);

  if (!isClient || (isAuthEnabled() && !isAuthenticated())) {
    return null;
  }

  return <DashBoardPage />;
};

export default Dashboard;
