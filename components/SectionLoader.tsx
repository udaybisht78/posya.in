"use client";

interface SectionLoaderProps {
  count?: number;
  shape?: "circle" | "rect";
  hasTitle?: boolean;
}

export default function SectionLoader({
  count = 3,
  shape = "rect",
  hasTitle = true,
}: SectionLoaderProps) {
  const items = Array.from({ length: count });

  return (
    <section className="py-12 px-4 md:px-12">
      {hasTitle && (
        <div className="h-8 w-48 bg-gray-200 rounded shimmer mx-auto mb-8"></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center animate-fadeIn space-y-3"
          >
            <div
              className={`${
                shape === "circle"
                  ? "rounded-full w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
                  : "rounded-lg w-full h-48 sm:h-60"
              } bg-gray-200 shimmer`}
            ></div>
            <div className="w-40 h-5 bg-gray-200 rounded shimmer"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
