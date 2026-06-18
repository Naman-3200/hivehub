import { CheckCheckIcon, CopyPlusIcon, User2Icon } from 'lucide-react'
import React from 'react'

const UseCase = () => {
  return (
    <div className="px-5 py-10 md:py-5">
      <div>
        {/* Section Label */}
        {/* <span className="items-center gap-3 text-center mx-auto w-fit bg-violet-500 text-white md:text-xl px-4 py-1 rounded-md text-sm font-semibold tracking-tighter flex ">
        <CheckCheckIcon /> AYO, THAT'S HOW YOU USE ZENNIT
        </span> */}

        {/* Heading & Description */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-6xl mx-auto md:mt-6 gap-4">
          <h1 className="text-xl md:text-3xl font-semibold tracking-tighter text-center md:text-left">
            Hivehub Tools and How to Use them
          </h1>
          <p className="text-muted-foreground text-center md:text-left max-w-md">
            Developed and designed with best practices for an elegant look every time.
          </p>
        </div>

        {/* Content placeholder */}
        <div>
            <div className="mt-8 md:mt-20 grid grid-cols-1  lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Card 1 */}
<div className="bg-[#e5e5e5] border-gray-300 border-2 rounded-2xl shadow-sm p-4 flex flex-col">
  <div className=" overflow-clip border border-b-4 border-gray-300 rounded-3xl relative cursor-pointer object-cover">
    
    <img src="https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/68b76289002771009b2fd9d8_dropship-product-library.png" alt="" />

  </div>
  
  <div className="mt-4 rounded-2xl">
    <h3 className="text-xl font-semibold tracking-tighter">Add products which you like in the store</h3>
    <p className="text-gray-500 font-semibold tracking-tight text-base">
      Helping businesses across various industries achieve their goals
    </p>
  </div>
</div>


      {/* Card 2 */}
      <div className="bg-[#222] rounded-2xl shadow-sm p-4 flex flex-col items-center">
        <div className="relative flex-col w-full items-center gap-10">
  
  
  <div className="relative mt-3 rounded-3xl p-2 overflow-hidden group">
    <img
      src="https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/687908f56ee87703f70fdee1_shop-finder-image.png"
      alt=""
      className="rounded-3xl border-b-4  hover:scale-105 transition-all duration-500 ease-out transform"
    />
    {/* Vignette overlay */}
    <div className="absolute inset-0 rounded-3xl pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_70%,rgba(0,0,0,0.15)_100%)]" />
  </div>
</div>

        <div className="mt-4 text-left rounded-2xl">
          <h3 className="text-xl font-semibold tracking-tighter text-white">Build and launch your store with those products</h3>
          <p className="text-gray-300 font-semibold text-base tracking-tight">
            Bringing seasoned expertise to every project
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#e5e5e5] rounded-2xl shadow-sm p-4 flex flex-col ">
        <div className="flex-grow flex flex-col justify-center bg-gray-300 items-center rounded-3xl overflow-hidden h-[220px]">

           <img src="https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/668d5647f2fb3fd09c76664a_Portfolio%20-%20Homepage.webp" alt="" className='rounded-3xl py-3 px-4 hover:scale-105 transition-all duration-500 ease-out transform'/>
          
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Earn Money by managing the store with all provided analytics</p>
          <p className="text-gray-500 font-semibold text-base tracking-tight">
            Become a Zennit Creator or Contribute on Zennit to make your pocket-money ;)
          </p>
        </div>
      </div>

    </div>
        </div>
      </div>
    </div>
  )
}

export default UseCase
