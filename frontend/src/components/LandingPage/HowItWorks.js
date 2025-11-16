import React from 'react';
import '../../Landing.css';

export default function HowItWorks(){
  return (
    <section className="how-section">
      <div className="how-inner">
        <h2 className="how-title">How It Works</h2>
        <p className="how-sub">Get started in three simple steps and transform your study experience</p>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <h3>Create Your Account</h3>
            <p>Sign up for free in seconds. No credit card required, no complicated setup.</p>
          </div>

          <div className="how-arrow" aria-hidden="true"> 
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="#7b46ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 6l6 6-6 6" stroke="#7b46ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          <div className="how-card">
            <div className="how-number">2</div>
            <h3>Organize Your Notes</h3>
            <p>Create folders, add notes, and structure your study materials the way you want.</p>
          </div>

          <div className="how-arrow" aria-hidden="true"> 
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="#7b46ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 6l6 6-6 6" stroke="#7b46ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          <div className="how-card">
            <div className="how-number">3</div>
            <h3>Study Smarter</h3>
            <p>Access your notes anywhere, collaborate with peers, and track your progress.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
