import React from 'react';
import '../../Landing.css';

export default function WhyChoose(){
  return (
    <section id="why-choose" className="why-section">
      <div className="why-inner">
        <h2 className="why-title">Why Choose Connectivity?</h2>
        <p className="why-sub">We provide everything you need to succeed academically</p>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" fill="currentColor"/></svg>
            </div>
            <h3>Lightning Fast</h3>
            <p>Access your notes instantly, no waiting, no lag</p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1l9 4v6c0 5-4 9-9 9s-9-4-9-9V5l9-4z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
            </div>
            <h3>Secure & Private</h3>
            <p>Your notes are encrypted and protected</p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 20v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
            </div>
            <h3>Easy Collaboration</h3>
            <p>Share and work together with classmates</p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
            </div>
            <h3>Goal Tracking</h3>
            <p>Monitor progress and achieve your targets</p>
          </div>
        </div>
      </div>
    </section>
  );
}
