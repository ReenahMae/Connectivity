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

function App() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="App landing-page">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <About />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
