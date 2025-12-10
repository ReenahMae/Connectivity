import React, { useEffect } from 'react';
import './App.css';
import './Landing.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import About from './components/LandingPage/About';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Settings from './components/Settings/Settings';
import HowItWorks from './components/LandingPage/HowItWorks';
import WhyChoose from './components/LandingPage/WhyChoose';
import CTA from './components/LandingPage/CTA';
import Footer from './components/LandingPage/Footer';
import ViewNote from './components/Notes/ViewNote';
import EditNote from './components/Notes/EditNote';
import Folders from './pages/Folders/Folders';
import FolderView from './pages/Folders/FolderView';
import ActivityLog from './pages/ActivityLog/ActivityLog';
import AllNotes from './components/Notes/AllNotes';
import StudyTimer from './components/StudyTimer/StudyTimer';

// Simple landing wrapper used as the home route
function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <About />
        <HowItWorks />
        <WhyChoose />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const location = useLocation();
  const hideNavbar =
  ['/login', '/register', '/settings', '/folders','/activity','/notes', '/timer',].includes(location.pathname) ||
  location.pathname.startsWith('/dashboard') ||
  location.pathname.startsWith('/note/') ||
  location.pathname.startsWith('/folder/');

  // Scroll to an element when the URL contains a hash (e.g. /#why-choose)
  useEffect(() => {
    if (location.hash) {
      // remove leading '#'
      const id = location.hash.replace('#', '');
      // small delay so the target exists after route update
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          // compute a gentle offset so the section appears lower in the viewport
          const offsetFromTop = Math.max(24, Math.round(window.innerHeight * 0.12));
          const top = el.getBoundingClientRect().top + window.pageYOffset - offsetFromTop;
          window.scrollTo({ top, behavior: 'smooth' });

          // add a temporary highlight class to draw attention
          el.classList.add('anchor-highlight');
          window.setTimeout(() => el.classList.remove('anchor-highlight'), 2000);
        }
      }, 60);
    }
  }, [location]);

  return (
    <div className="App landing-page">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Navigate to="/notes" replace />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folder/:folderId" element={<FolderView />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/note/new" element={<EditNote />} />
        <Route path="/note/:id" element={<ViewNote />} />
        <Route path="/note/:id/edit" element={<EditNote />} />
        <Route path="/notes" element={<AllNotes />} />

        <Route path="/timer" element={<StudyTimer />} />

      </Routes>
    </div>

    
  );
}

export default App;
