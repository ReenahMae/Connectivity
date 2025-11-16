import React from 'react';
import '../../Landing.css';

export default function CTA() {
  return (
    <section id="CTA" className="cta-section">
      <div className="cta-inner">
        <div className="cta-box">
          <h2 className="cta-title">Ready to Transform Your Studies?</h2>
          <p className="cta-sub">Join us who are already studying smarter with Connectivity</p>

          <div className="cta-actions">
            <a className="btn btn-primary" href="/register">Get Started for Free <span className="cta-arrow">→</span></a>
            <a className="btn btn-ghost" href="/register">Sign In</a>
          </div>
        </div>
      </div>
    </section>
  );
}
