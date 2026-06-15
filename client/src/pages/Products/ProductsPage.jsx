import ProductCard from "@/pages/LandingPage/Components/ProductCards";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-green-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-green-600 font-semibold uppercase tracking-widest">
            PurePuff Collection
          </span>

          <h1 className="mt-4 text-6xl font-bold">
            Our Products
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Discover our range of respiratory wellness products
            designed to support healthier breathing and a
            refreshing experience.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}