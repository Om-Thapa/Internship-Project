import ImpactStats from "@/pages/LandingPage/Components/ImpactStats";
import ProductCard from "@/pages/LandingPage/Components/ProductCards";
import ProductMockup from "@/pages/LandingPage/Components/ProductMockup";
import React from "react";
import AboutPurePuff from "./Components/AboutPurePuff";

const LandingPage = () => {
  const products = [
    {
      id: 1,
      image: "/Placeholder.png",
      name: "Mini Samosa | No Palm Oil | With 2 Chutneys Inside",
      price: 105,
    },
    {
      id: 2,
      image: "/Placeholder.png",
      name: "Mini Kachori | No Palm Oil | With 2 Chutneys Inside",
      price: 105,
    },
    {
      id: 3,
      image: "/Placeholder.png",
      name: "GO DESi Minis: Dark Choco Kaju Katli",
      price: 250,
    },
    {
      id: 4,
      image: "/Placeholder.png",
      name: "Kolkata Jhalmuri | Made with Mustard Oil | Pack of 3",
      price: 225,
    },
  ];

  return (
    <div className="w-full text-6xl mt-16 text-center">
      {/* Hero Product */}
      <section className="mt-18 bg-linear-to-r from-cyan-400 via-emerald-400 to-blue-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <div>
              <span className="bg-pink-500/80 text-white px-4 py-2 rounded-full text-4xl lg:text-6xl font-bold">
                🚀 New Launch
              </span>

              <h1 className="mt-10 text-6xl font-black">
                Perfect Convenient Snack!
              </h1>

              <p className="mt-6 text-xl">
                Crispy, delicious and packed with flavour.
              </p>

              {/* <button className="mt-8 bg-black text-white px-8 py-4 rounded-lg font-semibold">
                Shop Collection
              </button> */}
            </div>

            <div className="relative">
              <img
                src="/Placeholder.png"
                alt="Product"
                className="w-full max-w-2xl mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-200 py-16">
        <ImpactStats />
      </section>

      <section className="bg-white py-16">
        <AboutPurePuff />
      </section>

      <section className="mt-10">
        <ProductMockup
          image="/Placeholder.png"
          title="Mini Kachori"
          description="Crispy outside, flavourful inside. Made without palm oil and served with delicious chutneys."
        />

        <ProductMockup
          image="/Placeholder.png"
          title="Kolkata Jhalmuri"
          description="Authentic Bengali street-style snack made with mustard oil and traditional spices."
          reverse
        />

        <ProductMockup
          image="/Placeholder.png"
          title="Dark Choco Kaju Katli"
          description="A modern twist on traditional Indian sweets. Rich chocolate meets premium cashews."
        />
      </section>

      <section className="py-20 px-8">
        <h1 className="text-6xl text-green-400 font-bold font-serif">
          Our Products
        </h1>
        <div className="flex flex-wrap justify-around gap-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
