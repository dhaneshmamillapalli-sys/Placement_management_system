import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StatCard from "../components/StatCard";
import DriveCard from "../components/DriveCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const driveRes = await api.get("/drives");
        setDrives(driveRes.data);

        if (user.role === "student") {
          const appRes = await api.get("/applications/my");
          setApplications(appRes.data);
        } else {
          const studentRes = await api.get("/students");
          setStudents(studentRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role]);

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-10 text-mist">Loading dashboard...</div>;

  const upcomingDrives = drives.filter((d) => d.status === "upcoming").slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-mist text-sm mt-1 capitalize">{user.role} dashboard</p>
      </div>

      {user.role === "student" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <StatCard label="Applications submitted" value={applications.length} />
            <StatCard
              label="In progress"
              value={applications.filter((a) => a.overallStatus === "in-progress" || a.overallStatus === "applied").length}
            />
            <StatCard
              label="Offers received"
              value={applications.filter((a) => a.overallStatus === "selected").length}
              accent
            />
          </div>
        </>
      )}

      {(user.role === "admin" || user.role === "recruiter") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Active drives" value={drives.filter((d) => d.status !== "completed").length} />
          <StatCard label="Registered students" value={students.length} />
          <StatCard label="Placed students" value={students.filter((s) => s.studentProfile?.isPlaced).length} accent />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold">Upcoming drives</h2>
        <Link to="/drives" className="text-sm text-accent hover:underline">
          View all →
        </Link>
      </div>

      {upcomingDrives.length === 0 ? (
        <p className="text-mist text-sm">No upcoming drives at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingDrives.map((d) => (
            <DriveCard key={d._id} drive={d} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
