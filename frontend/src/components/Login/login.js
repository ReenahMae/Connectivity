import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import bookLogo from '../../assets/book_lg.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- added error state

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setError("Invalid Credentials");
      return;
    }

    const res = await response.json();   // parse JSON
    const data = res.data;               // get the actual user object

    if (!data || !data.token) {
      setError("Login failed: No token received.");
      return;
    }

    // Save JWT token
    localStorage.setItem("token", data.token);

    // Save userId separately for API calls
    localStorage.setItem("userId", data.id);

    // Save user info (for sidebar, initials, etc.)
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        fname: data.fname,
        lname: data.lname,
        email: data.email
      })
    );

    navigate("/dashboard");  // redirect after login

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