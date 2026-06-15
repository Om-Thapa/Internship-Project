export default function ProductMockup({
  image,
  title = "Image",
  description,
  reverse = false,
  buttonText = "Shop Now",
}) {
  return (
    <section className="py-6 overflow-hidden">
      <div
        className={`max-w-7xl mx-auto px-6 flex flex-col ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center gap-16`}
      >
        {/* Image */}
        <div className="flex-1">
          <img
            src={image}
            alt={title}
            className="w-full max-w-lg mx-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          <span className="text-green-500 font-semibold uppercase tracking-widest">
            New Launch
          </span>

          <h2 className="mt-4 text-5xl font-black leading-tight">
            {title}
          </h2>

          <p className="mt-6 text-gray-600 text-lg max-w-xl">
            {description}
          </p>

          {/* <button className="mt-8 bg-green-600/80 hover:bg-green-700/80 text-white px-8 py-4 font-semibold rounded-md transition">
            {buttonText}
          </button> */}
        </div>
      </div>
    </section>
  );
}