import React from "react";

const StatCard = ({ label, value, accent = false }) => (
  <div className="card p-5">
    <p className="label">{label}</p>
    <p className={`text-3xl font-display font-semibold mt-2 ${accent ? "text-accent" : "text-ivory"}`}>
      {value}
    </p>
  </div>
);

export default StatCard;
