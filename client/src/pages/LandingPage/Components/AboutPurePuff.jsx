export default function AboutPurePuff() {
  return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Side */}
          <div className="flex justify-center">
            <img
              src="/Placeholder.png"
              alt="PurePuff Mascot"
              className="w-full max-w-md"
            />
          </div>

          {/* Right Side */}
          <div>
            <span className="text-green-600 font-semibold uppercase tracking-widest">
              About PurePuff
            </span>

            <h2 className="text-4xl font-bold mt-4 mb-8">
              Every Breath Deserves Better
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              PurePuff was founded to tackle two growing challenges:
              air pollution and tobacco-related respiratory damage.
              We are building accessible wellness products that support
              lung health while promoting awareness about cleaner living.
            </p>

            <div className="space-y-4 mb-10 text-2xl lg:ml-6">
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span>Supports respiratory wellness</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span>Non-addictive formulation</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span>Portable and affordable</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span>Creating awareness about pollution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}