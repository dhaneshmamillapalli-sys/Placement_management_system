import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-line bg-panel/60 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-display font-semibold text-lg tracking-tight">
            Placement<span className="text-accent">Track</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-mist hover:text-ivory transition">
              Dashboard
            </Link>
            <Link to="/drives" className="text-sm text-mist hover:text-ivory transition">
              Drives
            </Link>
            {user.role === "student" && (
              <>
                <Link to="/applications" className="text-sm text-mist hover:text-ivory transition">
                  My Applications
                </Link>
                <Link to="/profile" className="text-sm text-mist hover:text-ivory transition">
                  Profile
                </Link>
              </>
            )}
            {(user.role === "admin" || user.role === "recruiter") && (
              <Link to="/students" className="text-sm text-mist hover:text-ivory transition">
                Students
              </Link>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-line">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="label">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary !py-1.5 !px-3 text-sm">
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
