import React, { useEffect, useState } from "react";
import api from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [branch, setBranch] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (branch) params.branch = branch;
    if (minCgpa) params.minCgpa = minCgpa;
    const { data } = await api.get("/students", { params });
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1">Student directory</h1>
      <p className="text-mist text-sm mb-6">Structured placement data across the batch</p>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Filter by branch (e.g. CSE)"
          className="input-field max-w-xs"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Min CGPA"
          className="input-field max-w-[140px]"
          value={minCgpa}
          onChange={(e) => setMinCgpa(e.target.value)}
        />
        <button onClick={load} className="btn-secondary">
          Filter
        </button>
      </div>

      {loading ? (
        <p className="text-mist text-sm">Loading students...</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="p-3 label">Name</th>
                <th className="p-3 label">Roll No.</th>
                <th className="p-3 label">Branch</th>
                <th className="p-3 label">CGPA</th>
                <th className="p-3 label">Backlogs</th>
                <th className="p-3 label">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b border-line last:border-0 hover:bg-panel2/50">
                  <td className="p-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-mist">{s.email}</p>
                  </td>
                  <td className="p-3 font-mono text-xs">{s.studentProfile?.rollNumber || "—"}</td>
                  <td className="p-3">{s.studentProfile?.branch || "—"}</td>
                  <td className="p-3 font-mono">{s.studentProfile?.cgpa ?? "—"}</td>
                  <td className="p-3 font-mono">{s.studentProfile?.backlogs ?? 0}</td>
                  <td className="p-3">
                    {s.studentProfile?.isPlaced ? (
                      <span className="badge border-accent text-accent">Placed</span>
                    ) : (
                      <span className="badge border-line text-mist">Seeking</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <p className="text-mist text-sm p-4">No students match this filter.</p>}
        </div>
      )}
    </div>
  );
};

export default Students;
