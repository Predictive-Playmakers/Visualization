import React, { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { getResponsiveDimensions } from "../utils/bracketCalculations";
import Plot from "react-plotly.js";
const TeamCard = ({
  team,
  isDragging = false,
  isDropTarget = false,
  isTopTeam,
  seed = "-",
  shapData,
  isPredicted
}) => {
 
  const { MATCH_HEIGHT } = getResponsiveDimensions();
  const minHeight = Math.floor(MATCH_HEIGHT / 2);

  return (
    <div
      className={`
        flex items-center p-1 2xl:p-2 border transition-colors
        ${isDragging ? "opacity-50" : ""}
        ${isDropTarget ? "border border-blue-500" : "hover:bg-gray-50 border-transparent"}
        ${isTopTeam ? "rounded-t-lg" : "rounded-b-lg"}
      `}
      style={{ minHeight: "40px" }}
    
    >
      <div className="w-7 h-7 flex items-center justify-center bg-blue-50 rounded text-xs font-medium text-blue-600">
        {seed || "-"}
      </div>
      <span className="text-xs 2xl:text-sm ml-1 2xl:ml-3 font-medium text-gray-900 truncate">
        {team?.name || "TBD"}
      </span>
      <span className="text-xs 2xl:text-sm text-gray-400 ml-1">
        {seed}
      </span>
      {team.score !== undefined && (
        <span className="text-xs 2xl:text-sm ml-auto text-gray-400 mr-0.5 2xl:mr-1">
          {team.score}
        </span>

      )}

     
    </div>
  );
};

const BracketMatch = ({ match, roundNumber, divisionId, activeTeam, shapData, isPredicted }) => {
  const { MATCH_WIDTH } = getResponsiveDimensions();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  }


  const plotData = shapData
    ? {
        data: [
          {
            type: "bar",
            x: Object.values(shapData.features).map((f) => f.effect), // SHAP effects
            y: shapData.featureNames, // Feature names
            orientation: "h",
            marker: {
              color: Object.values(shapData.features).map((e) =>
                e.effect > 0 ? "green" : "red"
              ),
            },
          },
        ],
        layout: {
          title: `Feature Contributions (Base: ${shapData.baseValue.toFixed(
            3
          )}, Output: ${shapData.outValue.toFixed(3)})`,
          xaxis: { title: "SHAP Value (Effect)" },
          yaxis: { title: "Feature" },
          margin: { l: 100 },
          height: 300,
        },
      }
    : null;


  const TeamSlot = ({ team, index, matchTeams }) => {
    const seed = index === 0 ?  Math.min(...matchTeams.map(t => Number(t.seed))) : Math.max(...matchTeams.map(t => Number(t.seed)))
    
    // if (roundNumber !== 0) {
    //   return <TeamCard seed={seed} team={team} isTopTeam={index === 0} />;
    // }

    const id = `${divisionId}-${team.seed}`;

    const {
      attributes,
      listeners,
      setNodeRef: setDragRef,
      isDragging,
    } = useDraggable({
      id,
      data: { team, divisionId },
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
      id,
      data: { team, divisionId },
    });

    const ref = (node) => {
      setDragRef(node);
      setDropRef(node);
    };

    const isDropTarget =
      activeTeam &&
      activeTeam.seed !== team.seed &&
      activeTeam.group === team.group &&
      isOver;

    return (
      <div ref={ref} {...attributes} {...listeners} className="cursor-move">
        <TeamCard
        seed={ seed}
          team={team}
          isDragging={isDragging}
          isDropTarget={isDropTarget}
          isTopTeam={index === 0}
          shapData={shapData}
          isPredicted={isPredicted}
        />
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200"
      style={{ width: MATCH_WIDTH }}
      onMouseEnter={handleMouseEnter} // Add hover start handler
      onMouseLeave={handleMouseLeave} // Add hover end handler
    >
      <div className="divide-y divide-gray-100">
        {match.teams.map((team, index) => (
          <TeamSlot key={index} team={team} index={index} matchTeams={match.teams} />
        ))}
      </div>

         {/* Hover SHAP Visualization */}
      {isPredicted && isHovered && shapData && (
        <div
        className="absolute bg-white border shadow-lg rounded-lg p-2"
        style={{
          top: "100%",
          left: "0",
          width: "500px", // Increased width for larger hover box
          zIndex: 1000, // Ensure it appears above other components
          }}
        >
          <Plot data={plotData.data} layout={plotData.layout} style={{ width: "100%", height: "400px" }} />
        </div>
      )}

    </div>
  );
};

export default BracketMatch;
