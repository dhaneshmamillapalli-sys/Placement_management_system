import React from "react";
import { Link } from "react-router-dom";

const statusBadge = {
  upcoming: "border-accent text-accent",
  ongoing: "border-warn text-warn",
  completed: "border-mist text-mist",
  cancelled: "border-danger text-danger",
};

const DriveCard = ({ drive }) => {
  const deadline = new Date(drive.applicationDeadline);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Link to={`/drives/${drive._id}`} className="card p-5 flex flex-col gap-3 hover:border-accent transition group">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-semibold text-lg group-hover:text-accent transition">
            {drive.companyName}
          </p>
          <p className="text-sm text-mist">{drive.jobRole}</p>
        </div>
        <span className={`badge ${statusBadge[drive.status] || "border-line text-mist"}`}>
          {drive.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono text-mist">
        <span className="badge border-line">{drive.jobType}</span>
        {drive.package && <span className="badge border-line">{drive.package}</span>}
        {drive.location && <span className="badge border-line">{drive.location}</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-mist pt-2 border-t border-line mt-1">
        <span>Drive date: {new Date(drive.driveDate).toLocaleDateString()}</span>
        <span className={daysLeft <= 3 && daysLeft >= 0 ? "text-warn font-medium" : ""}>
          {daysLeft >= 0 ? `${daysLeft} day(s) left to apply` : "Deadline passed"}
        </span>
      </div>
    </Link>
  );
};

export default DriveCard;
