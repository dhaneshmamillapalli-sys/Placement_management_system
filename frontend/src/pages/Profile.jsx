import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user } = useAuth();
  const profile = user.studentProfile || {};
  const [form, setForm] = useState({
    rollNumber: profile.rollNumber || "",
    branch: profile.branch || "",
    batch: profile.batch || "",
    cgpa: profile.cgpa || "",
    tenthPercentage: profile.tenthPercentage || "",
    twelfthPercentage: profile.twelfthPercentage || "",
    backlogs: profile.backlogs || 0,
    skills: (profile.skills || []).join(", "),
    phone: profile.phone || "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/students/profile", {
      ...form,
      cgpa: Number(form.cgpa),
      tenthPercentage: Number(form.tenthPercentage),
      twelfthPercentage: Number(form.twelfthPercentage),
      backlogs: Number(form.backlogs),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (user.role !== "student") {
    return <div className="max-w-3xl mx-auto px-6 py-10 text-mist">Profile editing is available for students only.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1">My placement profile</h1>
      <p className="text-mist text-sm mb-6">Keep this updated — it's used to auto-check drive eligibility</p>

      <form onSubmit={handleSubmit} className="card p-6 grid grid-cols-2 gap-4">
        {saved && (
          <div className="col-span-2 text-sm text-accent border border-accent/40 bg-accent/10 rounded-sm px-3 py-2">
            Profile saved successfully
          </div>
        )}
        <div>
          <label className="label">Roll number</label>
          <input name="rollNumber" className="input-field mt-1" value={form.rollNumber} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Branch</label>
          <input name="branch" className="input-field mt-1" value={form.branch} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Batch</label>
          <input name="batch" placeholder="2022-2026" className="input-field mt-1" value={form.batch} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input name="phone" className="input-field mt-1" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="label">CGPA</label>
          <input type="number" step="0.01" name="cgpa" className="input-field mt-1" value={form.cgpa} onChange={handleChange} />
        </div>
        <div>
          <label className="label">Backlogs</label>
          <input type="number" name="backlogs" className="input-field mt-1" value={form.backlogs} onChange={handleChange} />
        </div>
        <div>
          <label className="label">10th percentage</label>
          <input type="number" step="0.1" name="tenthPercentage" className="input-field mt-1" value={form.tenthPercentage} onChange={handleChange} />
        </div>
        <div>
          <label className="label">12th percentage</label>
          <input type="number" step="0.1" name="twelfthPercentage" className="input-field mt-1" value={form.twelfthPercentage} onChange={handleChange} />
        </div>
        <div className="col-span-2">
          <label className="label">Skills (comma separated)</label>
          <input name="skills" className="input-field mt-1" value={form.skills} onChange={handleChange} />
        </div>
        <div className="col-span-2">
          <button className="btn-primary">Save profile</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
