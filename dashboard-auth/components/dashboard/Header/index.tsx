"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
const Header = () => {
  const router = useRouter();
  const totalItems = useAppSelector((state) => state.cart.totalItems);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-gray-900 shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <div className="flex items-center">
        <div className="relative mr-4">
          <Link href={"/dashboard/cart"}>
            <ShoppingCart className="text-white h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
