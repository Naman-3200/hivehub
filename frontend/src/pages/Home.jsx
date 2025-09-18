import React from 'react'
import Hero from './Landing/Hero'
import Workflow from './Landing/Workflow'
import UseCase from './Landing/Working'
import { MembersCTA } from './Landing/TrailCta'
import Navbar from './Landing/Navbar'
import { Footer } from './Landing/Footer'
import { SupportedPlatforms } from './Landing/Platform'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <SupportedPlatforms />
      <Workflow />
      <UseCase />
      <MembersCTA />
      <Footer />
    </div>
  )
}

export default Home