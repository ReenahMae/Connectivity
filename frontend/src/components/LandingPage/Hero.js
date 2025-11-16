import React from 'react';
import '../../Landing.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">Stay Connected.<br/>Study Smarter.</h1>
        <p className="hero-sub">
        The ultimate note-taking platform designed for students.
        Organize <br />your study materials, collaborate with peers, and boost your <br />productivity.
        </p>       
          <div className="hero-ctas">
          <button className="btn btn-primary">Create Free Account</button>
          <button className="btn btn-ghost">Sign In</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
