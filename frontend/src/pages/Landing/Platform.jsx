import React from "react";

export function SupportedPlatforms() {
  const platforms = [
    {
      name: "Shopify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      name: "eBay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
    },
    {
      name: "WooCommerce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/2560px-WooCommerce_logo.svg.png",
    },
    {
      name: "BigCommerce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Bc-logo-dark.svg/2560px-Bc-logo-dark.svg.png",
    },
  ];

  return (
    <section className="px-4 py-10">
      <div className="max-w-7xl mx-auto text-center">
        <p className="uppercase text-gray-500 text-sm tracking-widest mb-8">
          Applicable to all sellers
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {platforms.map((p) => (
            <div key={p.name} className="flex justify-center">
              <img
                src={p.logo}
                alt={p.name}
                className="h-10 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
