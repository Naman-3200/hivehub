import React from 'react'
import Hero from './Landing/Hero'
import Workflow from './Landing/Workflow'
import UseCase from './Landing/Working'
import { MembersCTA } from './Landing/TrailCta'
import Navbar from './Landing/Navbar'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Workflow />
      <UseCase />
      <MembersCTA />
    </div>
  )
}

export default Home