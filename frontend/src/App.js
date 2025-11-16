import React from 'react';
import './App.css';
import './Landing.css';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import About from './components/LandingPage/About';

function App() {
  return (
    <div className="App landing-page">
      <Navbar />
      <main>
        <Hero />
        <Features />
          <About />

      </main>
    </div>
  );
}

export default App;
