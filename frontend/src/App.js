import React from 'react';
import './App.css';
import './Landing.css';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import About from './components/LandingPage/About';
import HowItWorks from './components/LandingPage/HowItWorks';
import WhyChoose from './components/LandingPage/WhyChoose';
import CTA from './components/LandingPage/CTA';
import Footer from './components/LandingPage/Footer';

function App() {
  return (
    <div className="App landing-page">
      <Navbar />
      <main>
        <Hero />
        <Features />
          <About />
          <HowItWorks />
          <WhyChoose />
          <CTA />
          <Footer />

      </main>
    </div>
  );
}

export default App;
