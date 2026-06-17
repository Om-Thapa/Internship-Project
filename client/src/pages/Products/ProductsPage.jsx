import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCards";
import { API } from "@/stores/authStore";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        if (mounted) setProducts(response.data || []);
      } catch (err) {
        if (mounted)
          setError(
            err.response?.data?.message ||
              "Unable to load products at the moment.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-green-50 py-5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-green-600 font-semibold uppercase tracking-widest">
            PurePuff Collection
          </span>

          <h1 className="mt-4 text-6xl font-bold">Our Products</h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Discover our range of respiratory wellness products designed to
            support healthier breathing and a refreshing experience.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-18">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="py-24 text-center text-lg text-slate-600">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-24 text-center text-lg text-red-600">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center text-lg text-slate-600">
              No products are available right now.
            </div>
          ) : (
            <div className="flex justify-around flex-wrap gap-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
