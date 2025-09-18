import React from "react";

export function MembersCTA() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white">
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
