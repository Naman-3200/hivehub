import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';



export default function Navbar() {
  // --- State to manage mobile menu visibility ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white text-gray-800 border-b-2 border-gray-200">
      <div className=' bg-violet-500 py-1 top-0'>hello</div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* --- Properly Responsive Header --- */}
        <header className="relative z-50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl md:text-4xl font-semibold text-black">Hivehub</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-x-6 bg-gray-800 rounded-full px-6 py-3">
                <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Home</a>
                <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Collection</a>
                <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">About Us</a>
                <a href="#" className="text-gray-200 hover:text-black text-sm font-medium">Contact Us</a>
              </nav>
            </div>

            <button className="hidden lg:flex bg-black text-white px-6 py-3 rounded-full text-sm font-medium items-center space-x-2 hover:bg-gray-900">
              <span>Contact Us</span>
              <ArrowRight size={16} />
            </button>
            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mt-2 p-5">
              <nav className="flex flex-col items-center gap-4">
                <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Home</a>
                <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Collection</a>
                <a href="#" className="text-gray-700 hover:text-black text-base font-medium">About Us</a>
                <a href="#" className="text-gray-700 hover:text-black text-base font-medium">Contact Us</a>
              </nav>
              <button className="mt-6 w-full bg-black text-white px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-900">
                <span>Contact Us</span>
                {/* <ArrowRight size={16} /> */}
              </button>
            </div>
          )}
        </header>

      
      </div>
    </div>
  );
}