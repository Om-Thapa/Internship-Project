export default function ImpactStats() {
  const stats = [
    {
      value: "1.3B",
      label: "smokers worldwide exposed to harmful toxins daily",
    },
    {
      value: "8.1M",
      label: "deaths globally linked to pollution every year",
    },
    {
      value: "7M",
      label: "annual deaths caused by direct tobacco use",
    },
    {
      value: "99%",
      label: "of people breathe air that exceeds safe limits",
    },
    {
      value: "2B+",
      label: "people affected by indoor air pollution",
    },
    {
      value: "24/7",
      label: "continuous exposure to harmful airborne particles",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-6xl font-bold text-center mb-4">
        The Air We Breathe Is Changing
      </h2>

      <p className="text-center text-gray-600 text-xl max-w-3xl mx-auto mb-16">
        Pollution and tobacco exposure silently impact millions of lives every
        year. Understanding the scale of the problem is the first step toward
        protecting respiratory health.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-gray-200">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border border-gray-200 p-10 min-h-[260px]"
          >
            <h3 className="text-7xl font-bold text-green-600 mb-4">
              {stat.value}
            </h3>

            <p className="text-2xl leading-relaxed">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
