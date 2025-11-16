import React from 'react';
import '../../Landing.css';
import { Link } from 'react-router-dom';

export default function Footer(){
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div>
              <div className="footer-name">Connectivity</div>
              <div className="footer-desc">The ultimate note-taking platform <br/> designed for students.</div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/#features">Features</Link></li>
              <li><Link to="/#why-choose">Why Connectivity</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/#about">About us</Link></li>
              
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/#CTA">Call to Action</Link></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Connectivity. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
