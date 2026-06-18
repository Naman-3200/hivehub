export function Footer() {
  const footerSections = [
    {
      title: "Products",
      links: ["Product Search", "Ad Library", "Competitor Research", "Market Analytics", "Trending Products"],
    },
    {
      title: "Fast Track",
      links: ["Getting Started", "Video Tutorials", "Best Practices", "Success Stories", "Webinars"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact", "Partners"],
    },
    {
      title: "Resources",
      links: ["Blog", "Help Center", "API Documentation", "Community", "Status Page"],
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Hivehub</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              The complete platform for dropshipping success. Find winning products, analyze competitors, and scale your
              business.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <span className="text-gray-600 text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <span className="text-gray-600 text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <span className="text-gray-600 text-sm">in</span>
              </div>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 Hivehub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
