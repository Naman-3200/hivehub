import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  return (
  <div className="min-h-screen w-full bg-[#f8fafc] relative">
  {/* Diagonal Stripes Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
    }}
  />
  
     {/* Your Content/Components */}
     <div className='relative z-10 flex justify-center items-center min-h-screen pt-10'>
        
         {/* Hero Section */}
      <section className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/40 border border-gray-400 text-sm">
          <span> Build your store and start selling </span>
        </div>

        <h1 className="text-3xl md:text-5xl text-gray-800 font-semibold tracking-tighter leading-tight">
          Discover best products  
          <br />online & Sell
        </h1>
        <p className="text-gray-500 text-xl mx-auto max-w-md font-medium tracking-tight mt-4">
          Find and monitor stores to gain insights into their revenue, sales, products, apps, and more.
        </p>

        {/* Email Signup */}
        <div className="mt-6 flex items-center justify-center gap-6 max-w-md mx-auto">
            <button       onClick={() => navigate("/user-dashboard")}
 className='cursor-pointer bg-violet-500 rounded-lg py-2 px-6 text-white font-semibold'>Start Free {">"}</button>
            <button className='cursor-pointer bg-violet-500 rounded-lg py-2 px-6 text-white font-semibold'>See Demo</button>

        </div>
        <div className='bg-gray-200 p-4 mt-10 w-full'>
            <div className='bg-gray-300 p-2 w-full'>
                <img src="https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/68aae5653e1614886c689f6f_home-hero-banner.png" alt="" className='h-[70vh]'/>
            </div>
        </div>
      </section>
     </div>
</div>
  )
}

export default Hero