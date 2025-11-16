import React from 'react';
import './App.css';
import './Landing.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import About from './components/LandingPage/About';
import Login from './components/Login/login';
import Register from './components/Register/register';
import HowItWorks from './components/LandingPage/HowItWorks';
import WhyChoose from './components/LandingPage/WhyChoose';
import CTA from './components/LandingPage/CTA';
import Footer from './components/LandingPage/Footer';

function App() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="App landing-page">
      {!hideNavbar && <Navbar />}
      <main>
        <Hero />
        <Features />
          <About />
        <HowItWorks />
        <WhyChoose />
        <CTA />
        

      </main>
      <Footer />
    </div>
  );
}

export default App;
