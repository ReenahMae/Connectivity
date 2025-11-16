import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import bookLogo from '../../assets/book_lg.jpg';



function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      alert("No user found. Please sign up first.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("session", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button type="button" className="back-btn" onClick={() => navigate('/')} aria-label="Back to landing">✕</button>
        <div className="icon">
          <img src={bookLogo} alt="Connectivity book logo" />
        </div>

        <h1>Welcome to Connectivity</h1>
        <p className="subtitle">Stay connected. Study smarter.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="switch-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
