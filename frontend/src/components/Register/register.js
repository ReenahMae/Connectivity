import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import bookLogo from '../../assets/book_lg.jpg';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: form.firstName,
          lname: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(result.message || "Error creating account");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Make sure backend is running.");
    }
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
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
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
