import { useCartStore } from "@/stores/useCartStore";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const {
    id,
    slug,
    image,
    name,
    category,
    price,
    rating,
  } = product;

  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col items-center text-center max-w-sm">
      {/* Product Image */}
      <div className="size-80 flex items-center justify-center overflow-hidden">
        <Link to={`/products/${slug}`}>
          <img
            src={image}
            alt={name}
            className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      {/* Product Name */}
      <Link to={`/products/${slug}`}>
        <h3 className="mt-6 text-xl font-semibold leading-tight">{name}</h3>
      </Link>

      {/* Price */}
      <p className="mt-4 text-lg font-medium">₹ {price}</p>

      {/* Add to Cart Button */}
      <button
        className="mt-8 bg-green-600/80 hover:bg-green-700/80 text-white px-12 py-4 text-lg font-semibold tracking-wide transition-colors"
        onClick={() =>
          addItem({
            id,
            name,
            image,
            price,
          })
        }
      >
        + ADD TO CART
      </button>
    </div>
  );
}
