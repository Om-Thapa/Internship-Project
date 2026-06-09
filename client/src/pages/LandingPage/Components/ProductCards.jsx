import { useCartStore } from "@/stores/useCartStore";

export default function ProductCard({ image, name, price, id }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col items-center text-center max-w-sm">
      {/* Product Image */}
      <div className="size-80 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={name}
          className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Product Name */}
      <h3 className="mt-6 text-xl font-semibold leading-tight">{name}</h3>

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
