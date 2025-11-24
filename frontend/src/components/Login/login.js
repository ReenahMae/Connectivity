import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import bookLogo from '../../assets/book_lg.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- added error state

  const handleSubmit = async (e) => { // <-- added async
    e.preventDefault();

    try {
      // Call backend login endpoint
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError("Invalid Credentials");
        return;
      }

      const data = await response.json();

      // Save JWT token in localStorage
      localStorage.setItem("token", data.data.token); 
      localStorage.setItem("user", JSON.stringify({
        fname: data.data.fname,
        lname: data.data.lname,
        email: data.data.email
      }));

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
            placeholder="sample@gmail.com"
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

          {error && <p style={{ color: "red" }}>{error}</p>} {/* display error */}
        </form>

        <p className="switch-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
