import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { products } from "@/data/products";

import { useCartStore } from "@/stores/useCartStore";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const product = products.find(
    (p) => p.slug === slug
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Product Image */}
          <div>
            <div className="rounded-3xl bg-muted p-10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>

            <span className="text-green-600 font-semibold uppercase tracking-wider">
              Respiratory Wellness
            </span>

            <h1 className="mt-4 text-5xl font-bold">
              {product.name}
            </h1>

            <p className="mt-6 text-2xl font-semibold">
              ₹{product.price}
            </p>

            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Benefits
              </h2>

              <div className="space-y-3">
                {product.benefits.map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle
                        size={18}
                        className="text-green-600"
                      />

                      <span>{benefit}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-10 bg-green-600 hover:bg-green-700"
              onClick={() => addItem(product)}
            >
              Add To Cart
            </Button>
          </div>

        </div>

        {/* Ingredients */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-8">
            Ingredients
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {product.ingredients.map(
              (ingredient) => (
                <div
                  key={ingredient}
                  className="border rounded-2xl p-6"
                >
                  {ingredient}
                </div>
              )
            )}
          </div>
        </section>

        {/* How To Use */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-6">
            How To Use
          </h2>

          <div className="rounded-2xl border p-8">
            <ol className="space-y-4 list-decimal ml-5">
              <li>
                Open the PurePuff pack.
              </li>

              <li>
                Consume after meals or when
                needed.
              </li>

              <li>
                Enjoy as part of your daily
                wellness routine.
              </li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  );
}