import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold">
            Placement<span className="text-accent">Track</span>
          </p>
          <p className="text-sm text-mist mt-1">Sign in to your placement account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-danger border border-danger/40 bg-danger/10 rounded-sm px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input-field mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input-field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button disabled={loading} className="btn-primary mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-mist mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>

        <div className="card mt-6 p-4 text-xs font-mono text-mist">
          <p className="text-ivory mb-1">Demo credentials (after running the seed script):</p>
          <p>admin@college.edu / admin123</p>
          <p>recruiter@techcorp.com / recruiter123</p>
          <p>aarav@college.edu / student123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
