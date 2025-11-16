import React from 'react';
import '../../Landing.css';

const MetricCard = ({ icon, value, label }) => (
  <div className="metric-card" role="group" aria-label={label}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
  </div>
);

export default function About() {
  return (
    <section className="about-section">
      <div className="about-inner">
        <h2 className="about-title">About Connectivity</h2>
        <p className="about-sub">We're on a mission to revolutionize how students learn, organize, and collaborate on their academic journey.</p>

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

          <div className="about-right">
            <div className="metrics-grid">
              <MetricCard icon="👥" value="10K+" label="Active Students" />
              <MetricCard icon="📘" value="50K+" label="Notes Created" />
              <MetricCard icon="🎯" value="98%" label="Satisfaction Rate" />
              <MetricCard icon="⚡" value="24/7" label="Access Anywhere" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}