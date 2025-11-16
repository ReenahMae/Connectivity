import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const notes = [
    {
      id: 1,
      title: 'Photosynthesis Summary',
      body: 'The process by which plants convert light energy into chemical energy...',
      modified: '2 hours ago'
    },
    {
      id: 2,
      title: 'Cell Division Notes',
      body: 'Mitosis vs meiosis key differences and checkpoints...',
      modified: 'Yesterday'
    },
    {
      id: 3,
      title: 'Quantum Basics',
      body: 'Superposition principle and uncertainty explained simply...',
      modified: '3 days ago'
    }
  ];

  return (
    <div className="dashboard-inner">
      <header className="dashboard-header">
        <div>
          <h1>My Notes</h1>
          <span className="note-count">{notes.length} notes</span>
        </div>
        <button className="new-note-btn">+ New Note</button>
      </header>
      <section className="notes-grid">
        {notes.map(n => (
          <article key={n.id} className="note-card">
            <div className="note-icon" aria-hidden="true">📄</div>
            <h3>{n.title}</h3>
            <p className="note-body">{n.body}</p>
            <p className="modified">Last modified {n.modified}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
 