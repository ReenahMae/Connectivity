import React from 'react';
import '../../Landing.css';

const FeatureCard = ({ icon, title, body }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="features">
      <div className="features-grid">
        <FeatureCard icon="📁" title="Organize Your Notes" body="Create folders and structure your study materials for easy access and management." />
        <FeatureCard icon="⏱️" title="Track Your Activity" body="Monitor your study sessions and see your progress over time with activity logs." />
        <FeatureCard icon="🔗" title="Collaborate Together" body="Share notes with classmates and work together on study materials seamlessly." />
      </div>
    </section>
  );
};

export default Features;
