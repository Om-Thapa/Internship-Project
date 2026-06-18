import ImpactStats from "@/pages/LandingPage/Components/ImpactStats";
import ProductCard from "@/components/ProductCards";
import ProductMockup from "@/components/ProductMockup";
import React, { useEffect, useState } from "react";
import AboutPurePuff from "./Components/AboutPurePuff";
import { API } from "@/stores/authStore";

const LandingPage = () => {
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
    <div className="w-full text-6xl mt-16 text-center">
      {/* Hero Product */}
      <section className="mt-18 bg-linear-to-r from-cyan-400 via-emerald-400 to-blue-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <div>
              <h1 className="mt-10 text-6xl font-black">
                Perfect Convenient Snack!
              </h1>

              {/* <p className="mt-6 text-xl">
                Crispy, delicious and packed with flavour.
              </p> */}

              {/* <button className="mt-8 bg-black text-white px-8 py-4 rounded-lg font-semibold">
                Shop Collection
              </button> */}
            </div>

            <div className="relative">
              <img
                src="/FROGGU-removebg-preview.png"
                alt="Product"
                className="w-full max-w-2xl mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <AboutPurePuff />
      </section>

      <section className="bg-zinc-200 py-16">
        <ImpactStats />
      </section>

      {/* <section className="mt-10">
        <ProductMockup
          image="/products/Purepuff_candy.jpeg"
          title="PurePuff Candy"
          description="Cooling menthol-infused candy that delivers an instant refreshing sensation."
        />

        <ProductMockup
          image="/candy mockup.png"
          title="PurePuff Tulsi"
          description="Tulsi-rich formulation inspired by traditional herbal wellness practices."
          reverse
        />

        <ProductMockup
          image="/candy mockup.png"
          title="PurePuff Honey Lemon"
          description="A soothing combination of honey and lemon with a refreshing finish."
        />
      </section> */}

      <section id="products" className="py-20 px-8">
        <h1 className="text-6xl text-green-400 font-bold font-serif">
          Our Products
        </h1>

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
          <div className="flex flex-wrap justify-around gap-12">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
