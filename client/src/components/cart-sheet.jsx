import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/contexts/cart-context";

export default function CartSheet() {
  const { isOpen, closeCart } = useCart();

  const items = [
    {
      id: 1,
      name: "PurePuff Detox Candy",
      price: 99,
      quantity: 1,
      image: "/Placeholder.png",
    },
    {
      id: 2,
      name: "PurePuff Menthol Candy",
      price: 129,
      quantity: 1,
      image: "/Placeholder.png",
    },
  ];

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {/* Products */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {item.name}
                    </h3>

                    <p className="mt-2 font-semibold">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Minus size={14} />
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Plus size={14} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
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
        <div className="border-t p-6">
          <div className="flex justify-between mb-4">
            <span className="font-medium">
              Estimated Total
            </span>

            <span className="font-bold text-xl">
              ₹{total}
            </span>
          </div>

          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}