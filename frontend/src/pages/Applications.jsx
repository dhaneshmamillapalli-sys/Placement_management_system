import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import RoundPipeline from "../components/RoundPipeline";

const overallBadge = {
  applied: "border-line text-mist",
  "in-progress": "border-warn text-warn",
  selected: "border-accent text-accent",
  rejected: "border-danger text-danger",
  withdrawn: "border-line text-mist",
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get("/applications/my");
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async (id) => {
    await api.put(`/applications/${id}/withdraw`);
    load();
  };

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-10 text-mist">Loading applications...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1">My applications</h1>
      <p className="text-mist text-sm mb-8">Track every drive you've applied to, round by round</p>

      {applications.length === 0 ? (
        <p className="text-mist text-sm">
          You haven't applied to any drives yet.{" "}
          <Link to="/drives" className="text-accent hover:underline">
            Browse drives →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div>
                  <Link to={`/drives/${app.drive._id}`} className="font-display font-semibold hover:text-accent transition">
                    {app.drive.companyName}
                  </Link>
                  <p className="text-sm text-mist">{app.drive.jobRole}</p>
                </div>
                <span className={`badge capitalize ${overallBadge[app.overallStatus]}`}>{app.overallStatus}</span>
              </div>
              <RoundPipeline rounds={app.roundResults} />
              {["applied", "in-progress"].includes(app.overallStatus) && (
                <button onClick={() => handleWithdraw(app._id)} className="text-xs text-danger hover:underline mt-3">
                  Withdraw application
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
