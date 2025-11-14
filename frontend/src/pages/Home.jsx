import React from 'react'
import Hero from './Landing/Hero'
import Workflow from './Landing/Workflow'
import UseCase from './Landing/Working'
import { MembersCTA } from './Landing/TrailCta'
import Navbar from './Landing/DashboardNavbar'
import { Footer } from './Landing/Footer'
import { SupportedPlatforms } from './Landing/Platform'
import LandingNavbar from './Landing/Navbar'

const Home = () => {
  return (
    <div>
      <LandingNavbar  />
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