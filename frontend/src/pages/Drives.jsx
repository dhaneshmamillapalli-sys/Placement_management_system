import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DriveCard from "../components/DriveCard";

const emptyForm = {
  companyName: "",
  jobRole: "",
  jobDescription: "",
  package: "",
  jobType: "Full-Time",
  location: "",
  minCgpa: 0,
  maxBacklogs: 0,
  allowedBranches: "",
  eligibleBatch: "",
  driveDate: "",
  applicationDeadline: "",
  rounds: "Online Test, Technical Interview, HR Interview",
};

const Drives = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const canManage = user.role === "admin" || user.role === "recruiter";

  const loadDrives = async () => {
    const { data } = await api.get("/drives", { params: statusFilter ? { status: statusFilter } : {} });
    setDrives(data);
  };

  useEffect(() => {
    loadDrives();
  }, [statusFilter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/drives", {
        companyName: form.companyName,
        jobRole: form.jobRole,
        jobDescription: form.jobDescription,
        package: form.package,
        jobType: form.jobType,
        location: form.location,
        eligibility: {
          minCgpa: Number(form.minCgpa),
          maxBacklogs: Number(form.maxBacklogs),
          allowedBranches: form.allowedBranches
            ? form.allowedBranches.split(",").map((b) => b.trim())
            : [],
          eligibleBatch: form.eligibleBatch,
        },
        rounds: form.rounds.split(",").map((name, idx) => ({ name: name.trim(), order: idx + 1 })),
        driveDate: form.driveDate,
        applicationDeadline: form.applicationDeadline,
      });
      setForm(emptyForm);
      setShowForm(false);
      loadDrives();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create drive");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Recruitment drives</h1>
          <p className="text-mist text-sm mt-1">Browse and track ongoing placement opportunities</p>
        </div>
        {canManage && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ New Drive"}
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {["", "upcoming", "ongoing", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`badge cursor-pointer ${
              statusFilter === s ? "border-accent text-accent" : "border-line text-mist"
            }`}
          >
            {s || "all"}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && (
            <div className="md:col-span-2 text-sm text-danger border border-danger/40 bg-danger/10 rounded-sm px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="label">Company name</label>
            <input name="companyName" required className="input-field mt-1" value={form.companyName} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Job role</label>
            <input name="jobRole" required className="input-field mt-1" value={form.jobRole} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Job description</label>
            <textarea name="jobDescription" rows={2} className="input-field mt-1" value={form.jobDescription} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Package (CTC)</label>
            <input name="package" placeholder="6.5 LPA" className="input-field mt-1" value={form.package} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Job type</label>
            <select name="jobType" className="input-field mt-1" value={form.jobType} onChange={handleChange}>
              <option>Full-Time</option>
              <option>Internship</option>
              <option>Internship + PPO</option>
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input name="location" className="input-field mt-1" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Eligible batch</label>
            <input name="eligibleBatch" placeholder="2022-2026" className="input-field mt-1" value={form.eligibleBatch} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Minimum CGPA</label>
            <input type="number" step="0.1" name="minCgpa" className="input-field mt-1" value={form.minCgpa} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Max backlogs allowed</label>
            <input type="number" name="maxBacklogs" className="input-field mt-1" value={form.maxBacklogs} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Allowed branches (comma separated, blank = all)</label>
            <input name="allowedBranches" placeholder="CSE, IT, ECE" className="input-field mt-1" value={form.allowedBranches} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Recruitment rounds (comma separated, in order)</label>
            <input name="rounds" className="input-field mt-1" value={form.rounds} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Drive date</label>
            <input type="date" name="driveDate" required className="input-field mt-1" value={form.driveDate} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Application deadline</label>
            <input type="date" name="applicationDeadline" required className="input-field mt-1" value={form.applicationDeadline} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary">Publish drive</button>
          </div>
        </form>
      )}

      {drives.length === 0 ? (
        <p className="text-mist text-sm">No drives found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drives.map((d) => (
            <DriveCard key={d._id} drive={d} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Drives;
