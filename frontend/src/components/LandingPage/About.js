import React from 'react';
import '../../Landing.css';



export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-inner">
        <h2 className="about-title">About Connectivity</h2>
        <p className="about-sub">We're on a mission to revolutionize how students learn, organize, and collaborate <br/>on their academic journey.</p>

        <div className="about-grid">
          <div className="about-left">
            <h3 className="about-left-heading">Built for Students, By Educators</h3>
            <p className="about-left-text">
              Connectivity was created with a deep understanding of student needs. We know that organizing study materials, tracking progress, and collaborating with peers can be overwhelming.
            </p>
            <p className="about-left-text">
              Our platform combines intuitive design with powerful features to help you stay focused on what matters most: learning and achieving your academic goals.
            </p>

            <ul className="about-features">
              <li><strong>Student-Centric Design</strong><span>Every feature is designed with student productivity in mind</span></li>
              <li><strong>Seamless Collaboration</strong><span>Work together with classmates effortlessly</span></li>
              <li><strong>Always Improving</strong><span>Regular updates based on student feedback</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}