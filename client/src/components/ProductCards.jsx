// ProductCards.jsx

import { Link } from "react-router-dom";

import { useCartStore } from "@/stores/useCartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  return (
    <div className="flex flex-col items-center text-center">
      <Link
        to={`/products/${product.slug}`}
        className="block"
      >
        <div className="size-80 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      {/* <span className="mt-4 text-sm font-medium text-green-600 uppercase tracking-wider">
        {product.category}
      </span> */}

      <Link
        to={`/products/${product.slug}`}
      >
        <h3 className="mt-3 text-xl font-semibold">
          {product.name}
        </h3>
      </Link>

      {/* <p className="mt-2 text-sm text-gray-500">
        ⭐ {product.rating}
      </p> */}

      <p className="mt-4 text-lg font-medium">
        ₹{product.price}
      </p>

      <button
        onClick={() => addItem(product)}
        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold tracking-wide transition-colors"
      >
        Add To Cart
      </button>
    </div>
  );
}