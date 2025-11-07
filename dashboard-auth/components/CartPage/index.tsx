"use client";
import { useAppSelector } from "@/store/hooks";
import {
  removeItemFromCart,
  updateCartItem,
} from "@/services/addToCartService";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const CartPage = () => {
  const { items, totalItems, totalPrice } = useAppSelector(
    (state) => state.cart
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handleRemove = (id: number) => {
    removeItemFromCart(id);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity > 0) {
      updateCartItem(id, quantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 min-h-[300px]">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={80}
                height={80}
                className="rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </Button>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg">Total Items: {totalItems}</span>
              <span className="text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button className="w-1/6" size="lg">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
