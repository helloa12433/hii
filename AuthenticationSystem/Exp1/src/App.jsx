// Create Login Form with React State Management

import { useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
    } else {
      setError("");
      console.log("Username:", username);
      console.log("Password:", password);
      alert("Login Successful (check console)");
    }
  };

  return (
    <div className="container">
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

    </div>
  );
}
