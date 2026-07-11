import React from "react";

// The signature visual of the app: a recruitment pipeline rendered as a chain of
// connected nodes. Each node's fill encodes its status (cleared / pending / rejected),
// making the round-by-round journey scannable at a glance.
const statusStyles = {
  cleared: { ring: "border-accent bg-accent/10 text-accent", line: "bg-accent" },
  pending: { ring: "border-warn bg-warn/10 text-warn", line: "bg-line" },
  rejected: { ring: "border-danger bg-danger/10 text-danger", line: "bg-line" },
};

const RoundPipeline = ({ rounds }) => {
  if (!rounds || rounds.length === 0) {
    return <p className="text-sm text-mist">No rounds defined for this drive yet.</p>;
  }

  return (
    <div className="flex items-start w-full overflow-x-auto py-2">
      {rounds.map((round, idx) => {
        const status = round.status || "pending";
        const style = statusStyles[status] || statusStyles.pending;
        const isLast = idx === rounds.length - 1;

        return (
          <div key={round.roundId || round._id || idx} className="flex items-center shrink-0">
            <div className="flex flex-col items-center w-28 text-center">
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-mono text-xs font-semibold ${style.ring}`}
              >
                {status === "cleared" ? "✓" : status === "rejected" ? "✕" : idx + 1}
              </div>
              <p className="text-xs mt-2 text-ivory font-medium leading-tight">{round.roundName || round.name}</p>
              <p className="label mt-0.5">{status}</p>
            </div>
            {!isLast && <div className={`h-0.5 w-10 mt-[18px] ${style.line}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default RoundPipeline;
