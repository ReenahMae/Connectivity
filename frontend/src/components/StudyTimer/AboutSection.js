import React from "react";
import { BookOpen } from "lucide-react";
import "./AboutSection.css";

const AboutSection = ({ selectedMode }) => {
  const aboutData = {
    pomodoro: {
      title: "About Pomodoro Technique",
      focus: { label: "Focus Duration", value: "25 minutes of focus" },
      shortBreak: { label: "Short Break", value: "5 minutes to recharge" },
      longBreak: { label: "Long Break", value: "15 minutes after 4 sessions" },
    },

    deepWork: {
      title: "About Deep Work Technique",
      focus: { label: "Focus Duration", value: "90 minutes of focus" },
      shortBreak: { label: "Short Break", value: "20 minutes to recharge" },
      longBreak: { label: "Long Break", value: "30 minutes after 2 sessions" },
    },

    shortBurst: {
      title: "About Short Burst Technique",
      focus: { label: "Focus Duration", value: "15 minutes of focus" },
      shortBreak: { label: "Short Break", value: "3 minutes to recharge" },
      longBreak: { label: "Long Break", value: "10 minutes after 6 sessions" },
    },

    extendedFocus: {
      title: "About Extended Focus Technique",
      focus: { label: "Focus Duration", value: "50 minutes of focus" },
      shortBreak: { label: "Short Break", value: "10 minutes to recharge" },
      longBreak: { label: "Long Break", value: "25 minutes after 3 sessions" },
    },
  };

  const data = aboutData[selectedMode];

  return (
    <div className="about-container">
      <div className="about-header">
        <BookOpen size={20} className="about-icon" />
        <h2>{data.title}</h2>
      </div>

      <div className="about-cards">
        <div className="about-card purple-soft">
          <h3>{data.focus.label}</h3>
          <p>{data.focus.value}</p>
        </div>

        <div className="about-card green-soft">
          <h3>{data.shortBreak.label}</h3>
          <p>{data.shortBreak.value}</p>
        </div>

        <div className="about-card blue-soft">
          <h3>{data.longBreak.label}</h3>
          <p>{data.longBreak.value}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
