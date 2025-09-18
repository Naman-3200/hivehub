import React from "react";

export default function Workflow() {
  return (
    <section className="bg-white px-4 md:px-20">
      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div className="rounded-xl overflow-hidden  border-gray-300 border-4">
          <img
            src="https://liveimages.algoworks.com/new-algoworks/wp-content/uploads/2022/06/23175149/retail-and-consumer-goods-mobile-min.gif"
            alt="Couple posting property"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="space-y-6 flex flex-col items-end">
          <div className="text-sm text-gray-500 uppercase font-semibold">
            Do you want to sell?
          </div>
          <h2 className="text-2xl md:text-4xl text-right tracking-tighter max-w-md font-semibold text-gray-800 leading-snug">
            Millions of products on{" "}
            <span className="text-violet-500"> Hivehub</span> at your fingertips
          </h2>
          <p className="text-sm md:text-md text-right max-w-md text-gray-600">
           Find your next profitable product by exploring our vast database with millions of them. Use our smart filters to refine your search and find winning products tailored to your interests and niche.
          </p>
          
          <button className="mt-4 px-4  md:px-6 py-2 md:py-3 bg-violet-500 text-white rounded-xl text-base tracking-tighter hover:bg-violet-400 transition duration-200">
            Explore Products
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-32">
        {/* Right: Content */}
        <div className="space-y-6 flex flex-col items-start">
          <div className="text-sm text-gray-500 uppercase font-semibold">
            Do you want to sell?
          </div>
          <h2 className="text-2xl md:text-4xl text-left tracking-tighter max-w-md font-semibold text-gray-800 leading-snug">
            Browse winning products by trends, prices and bestsellers
          </h2>
          <p className="text-sm md:text-md text-left max-w-md text-gray-600">
           Analyze high performing products by product data to uncover proven strategies and optimize your stores for maximum ROI and engagement.
          </p>
          
          <button className="mt-4 px-4  md:px-6 py-2 md:py-3 bg-violet-500 text-white rounded-xl text-base tracking-tighter hover:bg-violet-400 transition duration-200">
            Explore Products
          </button>
        </div>

             {/* Left: Image */}
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/6775d1d36529b20dd3688453_dropship-ad-library.avif"
            alt="Couple posting property"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
}
