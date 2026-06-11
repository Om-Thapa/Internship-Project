import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Minus, Plus, Trash2 } from "lucide-react";

import { useCartStore } from "@/stores/useCartStore";
import { useCartTotal } from "@/stores/cartSelectors";
import { Link } from "react-router-dom";

export default function CartSheet() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = useCartTotal();

  const shipping = total > 499 ? 0 : 49;
  const discount = 50;
  const finalTotal = Math.max(total + shipping - discount, 0);

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => {
        if (!open) closeCart();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Your Cart {items?.length ?? 0}</SheetTitle>
        </SheetHeader>

        {/* Products */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {items?.map((item) => (
              <div key={item.id} className="border rounded-xl p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>

                    <p className="mt-2 font-semibold">₹{item.price}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={14} />
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={14} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-6 space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{total}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{shipping}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">−₹{discount}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">₹{finalTotal}</span>
          </div>

          {/* Shipping Message */}
          <p className="text-xs text-gray-500 text-center">
            Free shipping on orders above ₹499
          </p>

          {/* Checkout Button */}
          <SheetClose asChild>
            <Link to="/cart">
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Checkout
              </Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
