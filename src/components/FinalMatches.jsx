import React from "react";
import { ChevronRight } from "lucide-react";

const FinalMatches = ({ data }) => {
  const MatchBox = ({ title, teams, isCenter }) => (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-xl ${
        isCenter ? "border-yellow-400 border-2" : ""
      }`}
      style={{
        width: "200px",
      }}
    >
      {title && (
        <div className="px-3 py-1 bg-gray-50 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {teams.map((team, index) => (
          <div
            key={index}
            className={`flex items-center p-2 ${
              team.name ? "hover:bg-blue-50 cursor-pointer" : "bg-gray-50"
            } transition-colors group`}
          >
            <div className="w-7 h-7 flex items-center justify-center bg-blue-50 rounded text-xs font-medium text-blue-600 group-hover:bg-blue-100">
              {team.seed || "-"}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {team.name || "TBD"}
            </span>
            {team.score !== undefined && (
              <span className="ml-auto text-sm text-gray-600 mr-1">
                {team.score}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="relative scale-[92%] 2xl:scale-[100%]"
      style={{ height: "300px" }}
    >
      <svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
        <path
          d="M 200 67 H 300 V 134 H 400"
          stroke="#CBD5E1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 600 67 H 500 V 134 H 400"
          stroke="#CBD5E1"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="absolute left-12 -top-0">
        <MatchBox title="Final Four" teams={data.semifinals[0].teams} />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-24 scale-[110%]">
        <MatchBox
          title="Championship"
          teams={data.championship.teams}
          isCenter={true}
        />
      </div>

      <div className="absolute right-12 -top-0">
        <MatchBox title="Final Four" teams={data.semifinals[1].teams} />
      </div>
    </div>
  );
};

export default FinalMatches;
