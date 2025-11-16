import React from 'react';
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';

const LandingPage = () => {
  return (
    <div className='landing-page'>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default LandingPage;
