import React from "react";

export function MembersCTA() {
  return (
    <section className="relative px-4 py-16 overflow-clip">
      <div className="max-w-7xl mx-auto">
        <div className="bg-violet-600 rounded-3xl relative overflow-clip p-8 md:p-12 text-white">
            {/* Diagonal Fade Grid Background - Top Right */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: "32px 32px",
      WebkitMaskImage:
        "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
      maskImage:
        "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
    }}
  />
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                300,000+ products using Hivehub and 100+ Stores creared
              </h2>
              <p className="text-blue-100 leading-relaxed">
                Join millions of entrepreneurs who trust Hivehub to scale
                their e-commerce businesses. Get access to winning products,
                market insights, and powerful tools.
              </p>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition">
                Start today
              </button>
            </div>

            {/* Right content - YouTube embed */}
            <div className="relative">
              <div className="bg-blue-700 rounded-2xl overflow-hidden aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Example Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
