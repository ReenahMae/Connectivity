import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import bookLogo from '../../assets/book_lg.jpg';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
          <button type="button" className="back-btn" onClick={() => navigate('/')} aria-label="Back to landing">✕</button>
        <div className="icon">
          <img src={bookLogo} alt="Connectivity book logo" />
        </div>

        <h1>Start your Learning Journey</h1>
        <p className="subtitle">
          Join Connectivity and start your learning journey
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="student@university.edu"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
