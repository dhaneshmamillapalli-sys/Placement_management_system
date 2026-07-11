import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    branch: "",
    batch: "",
    cgpa: "",
    companyName: "",
    designation: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role,
    };

    if (role === "student") {
      payload.studentProfile = {
        rollNumber: form.rollNumber,
        branch: form.branch,
        batch: form.batch,
        cgpa: Number(form.cgpa) || 0,
      };
    }
    if (role === "recruiter") {
      payload.recruiterProfile = {
        companyName: form.companyName,
        designation: form.designation,
      };
    }

    const res = await register(payload);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-semibold">
            Placement<span className="text-accent">Track</span>
          </p>
          <p className="text-sm text-mist mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-danger border border-danger/40 bg-danger/10 rounded-sm px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="label">I am a</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {["student", "admin", "recruiter"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-sm text-sm capitalize border transition ${
                    role === r ? "border-accent text-accent bg-accent/10" : "border-line text-mist"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Full name</label>
            <input name="name" required className="input-field mt-1" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field mt-1"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="input-field mt-1"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {role === "student" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Roll number</label>
                <input name="rollNumber" className="input-field mt-1" value={form.rollNumber} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Branch</label>
                <input name="branch" placeholder="CSE" className="input-field mt-1" value={form.branch} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Batch</label>
                <input
                  name="batch"
                  placeholder="2022-2026"
                  className="input-field mt-1"
                  value={form.batch}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  className="input-field mt-1"
                  value={form.cgpa}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {role === "recruiter" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Company</label>
                <input name="companyName" className="input-field mt-1" value={form.companyName} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Designation</label>
                <input name="designation" className="input-field mt-1" value={form.designation} onChange={handleChange} />
              </div>
            </div>
          )}

          <button disabled={loading} className="btn-primary mt-2">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-mist mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
