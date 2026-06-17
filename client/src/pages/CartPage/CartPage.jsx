import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCartStore } from "@/stores/useCartStore";
import { useCartTotal } from "@/stores/cartSelectors";
import { Link } from "react-router-dom";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = useCartTotal();

  const freeShippingThreshold = 499;

  const shipping = subtotal >= freeShippingThreshold ? 0 : 49;

  const discount = subtotal >= 299 ? 50 : 0;

  const total = subtotal + shipping - discount;

  const amountRemaining = freeShippingThreshold - subtotal;

  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-15">
          <div className="flex flex-col items-center text-center">
            {/* Illustration */}
            <img
              src="/empty-cart.png"
              alt="Empty Cart"
              className="w-72 h-72 object-contain"
            />
            
            <h1 className="text-4xl font-bold">
              🌿 Your Cart Feels Light
            </h1>

            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Add some PurePuff products and take a step toward better
              respiratory wellness.
            </p>

            <Link
              to="/products"
              className="mt-8 rounded-xl bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-green-600">Cart</h1>

          {subtotal < freeShippingThreshold && (
            <p className="mt-6 text-lg text-muted-foreground">
              Spend ₹{amountRemaining} more and get free shipping!
            </p>
          )}
          {subtotal > freeShippingThreshold && (
            <p className="mt-6 text-lg text-muted-foreground">
              You are eligible for free shipping!
            </p>
          )}

          <div className="max-w-md mx-auto mt-6">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
          {/* Products */}
          <div>
            <div className="grid grid-cols-[4fr_1fr_1fr] border-b pb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <div>Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="py-8">
                  <div className="grid grid-cols-[4fr_1fr_1fr] gap-4 items-center">
                    {/* Product */}
                    <div className="flex gap-5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-contain"
                      />

                      <div>
                        <h3 className="font-medium text-lg">{item.name}</h3>

                        <p className="mt-2 text-muted-foreground">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="p-2"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-4">{item.quantity}</span>

                        <button
                          className="p-2"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right font-semibold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-28 border rounded-2xl p-6">
              <h2 className="text-3xl font-bold mb-8">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-8 bg-green-600 hover:bg-green-700"
              >
                Checkout
              </Button>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
