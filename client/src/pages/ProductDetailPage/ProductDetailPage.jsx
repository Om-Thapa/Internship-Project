import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { API } from "@/stores/authStore";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${slug}`);
        if (mounted) setProduct(response.data);
      } catch (err) {
        if (mounted)
          setError(
            err.response?.data?.message || "Unable to load this product.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
        <Link
          to="/products"
          className="rounded-2xl bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

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

            <h1 className="mt-4 text-5xl font-bold">{product.name}</h1>

            <p className="mt-6 text-2xl font-semibold">₹{product.price}</p>

            {/* <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p> */}

            {/* Benefits */}
            {/* <div className="mt-8">
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
            </div> */}

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
        {/* <section className="mt-24">
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
        </section> */}

        {/* How To Use */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-6">How To Use</h2>

          <div className="rounded-2xl border p-8">
            <ol className="space-y-4 list-decimal ml-5">
              <li>Open the PurePuff pack.</li>

              <li>Consume after meals or when needed.</li>

              <li>Enjoy as part of your daily wellness routine.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
