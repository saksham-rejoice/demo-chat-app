"use client";
import {useEffect } from "react";
import { useRouter } from "next/navigation";
const InstagramClone = () => {
   const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/instagram/feed");
  }, [router]);
  return (
    <div className="p-6">
      <p className="text-white">Redirecting to feed...</p>
    </div>
  );
};

export default InstagramClone;
