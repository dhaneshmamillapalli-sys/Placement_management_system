import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RoundPipeline from "../components/RoundPipeline";

const DriveDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [drive, setDrive] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [myApplication, setMyApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/drives/${id}`);
    setDrive(data);

    if (user.role === "student") {
      const eligRes = await api.get(`/students/eligibility/${id}`);
      setEligibility(eligRes.data);

      const myApps = await api.get("/applications/my");
      const existing = myApps.data.find((a) => a.drive._id === id);
      setMyApplication(existing || null);
    } else {
      const applicantRes = await api.get(`/drives/${id}/applicants`);
      setApplicants(applicantRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = async () => {
    setMessage("");
    try {
      await api.post("/applications", { driveId: id });
      setMessage("Application submitted successfully!");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  const handleRoundUpdate = async (applicationId, roundId, status) => {
    await api.put(`/applications/${applicationId}/round`, { roundId, status });
    load();
  };

  if (loading || !drive) return <div className="max-w-5xl mx-auto px-6 py-10 text-mist">Loading drive...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">{drive.companyName}</h1>
            <p className="text-mist">{drive.jobRole}</p>
          </div>
          <span className="badge border-accent text-accent">{drive.status}</span>
        </div>

        <p className="text-sm text-ivory/80 mt-4">{drive.jobDescription}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="label">Package</p>
            <p className="mt-1">{drive.package || "Not disclosed"}</p>
          </div>
          <div>
            <p className="label">Type</p>
            <p className="mt-1">{drive.jobType}</p>
          </div>
          <div>
            <p className="label">Location</p>
            <p className="mt-1">{drive.location || "—"}</p>
          </div>
          <div>
            <p className="label">Deadline</p>
            <p className="mt-1">{new Date(drive.applicationDeadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="label">Min CGPA</p>
            <p className="mt-1 font-mono">{drive.eligibility.minCgpa}</p>
          </div>
          <div>
            <p className="label">Max backlogs</p>
            <p className="mt-1 font-mono">{drive.eligibility.maxBacklogs}</p>
          </div>
          <div>
            <p className="label">Branches</p>
            <p className="mt-1 font-mono">
              {drive.eligibility.allowedBranches?.length ? drive.eligibility.allowedBranches.join(", ") : "All"}
            </p>
          </div>
          <div>
            <p className="label">Batch</p>
            <p className="mt-1 font-mono">{drive.eligibility.eligibleBatch || "Any"}</p>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold mb-4">Recruitment pipeline</h2>
        <RoundPipeline rounds={drive.rounds.map((r) => ({ ...r, status: "pending" }))} />
      </div>

      {user.role === "student" && (
        <div className="card p-6">
          {myApplication ? (
            <>
              <h2 className="font-display font-semibold mb-1">Your application status</h2>
              <p className="text-sm text-mist mb-4">
                Applied on {new Date(myApplication.appliedAt).toLocaleDateString()} · Overall status:{" "}
                <span className="text-accent font-medium capitalize">{myApplication.overallStatus}</span>
              </p>
              <RoundPipeline rounds={myApplication.roundResults} />
            </>
          ) : (
            <>
              <h2 className="font-display font-semibold mb-3">Eligibility check</h2>
              {eligibility?.eligible ? (
                <div className="text-accent text-sm mb-4">✓ You meet all eligibility criteria for this drive.</div>
              ) : (
                <div className="text-danger text-sm mb-4">
                  <p className="mb-1">✕ You are not eligible for this drive:</p>
                  <ul className="list-disc list-inside text-mist">
                    {eligibility?.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {message && <p className="text-sm text-warn mb-3">{message}</p>}
              <button
                onClick={handleApply}
                disabled={!eligibility?.eligible}
                className="btn-primary"
              >
                Apply now
              </button>
            </>
          )}
        </div>
      )}

      {(user.role === "admin" || user.role === "recruiter") && (
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4">Applicants ({applicants.length})</h2>
          {applicants.length === 0 ? (
            <p className="text-mist text-sm">No applications received yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {applicants.map((app) => (
                <div key={app._id} className="border border-line rounded-md p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <p className="font-medium">{app.student.name}</p>
                      <p className="text-xs text-mist font-mono">
                        {app.student.studentProfile?.rollNumber} · {app.student.studentProfile?.branch} · CGPA{" "}
                        {app.student.studentProfile?.cgpa}
                      </p>
                    </div>
                    <span className="badge border-line text-mist capitalize">{app.overallStatus}</span>
                  </div>
                  <RoundPipeline rounds={app.roundResults} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {app.roundResults.map((r) => (
                      <div key={r.roundId} className="flex items-center gap-1.5 bg-ink border border-line rounded-sm px-2 py-1">
                        <span className="text-xs text-mist">{r.roundName}:</span>
                        <button
                          onClick={() => handleRoundUpdate(app._id, r.roundId, "cleared")}
                          className="text-xs text-accent hover:underline"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => handleRoundUpdate(app._id, r.roundId, "rejected")}
                          className="text-xs text-danger hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriveDetails;
