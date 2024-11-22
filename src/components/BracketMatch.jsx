import React, { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { getResponsiveDimensions } from "../utils/bracketCalculations";
import { createPortal } from "react-dom";

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
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
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

  const hoverContent = isPredicted && isHovered && shapData && (
    <div
      className="absolute bg-white border shadow-lg rounded-lg p-2"
      style={{
        position: "absolute",
        top: hoverPosition.top,
        left: hoverPosition.left,
        transform: "translateX(-50%)",
        width: "500px",
        zIndex: 1000,
      }}
    >
      <Plot data={plotData.data} layout={plotData.layout} style={{ width: "100%", height: "400px" }} />
    </div>
  );


  const handleMouseEnter = (event) => {
    setIsHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: rect.bottom + window.scrollY, // Account for scrolling
      left: rect.left + rect.width / 2 + window.scrollX, // Center horizontally
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  }
 

  const TeamSlot = ({ team, index, matchTeams }) => {

    const correctSeeds = {
      1: 1, 2: 16, 3: 8, 4: 9, 5:5, 6: 12, 7:4, 8:13, 9:6, 10:11, 11:3, 12:14, 13:7, 14:10, 15:2, 16:15,
      17: 1, 18:16, 19: 8, 20:9, 21:5, 22: 12, 23:4, 24:13, 25:6, 26:11, 27:3, 28:14, 29:7, 30:10, 31:2, 32:15,
      33: 1, 34:16, 35: 8, 36:9, 37:5, 38: 12, 39:4, 40:13, 41:6, 42:11, 43:3, 44:14, 45:7, 46:10, 47:2, 48:15,
      49: 1, 50:16, 51: 8, 52:9, 53:5, 54: 12, 55:4, 56:13, 57:6, 58:11, 59:3, 60:14, 61:7, 62:10, 63:2, 64:15,
      
     }
  

    const seed = index === 0 ?  Math.min(...matchTeams.map(t => Number(t.seed))) : Math.max(...matchTeams.map(t => Number(t.seed)))
    
    if (roundNumber !== 0) {
      return <TeamCard seed={correctSeeds[seed]} team={team} isTopTeam={index === 0} />;
    }

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
        seed={correctSeeds[seed]}
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
    <div className="relative z-[1]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200"
      style={{ width: MATCH_WIDTH }}
    >
      <div className="divide-y divide-gray-100">
        {match.teams.map((team, index) => (
          <TeamSlot key={index} team={team} index={index} matchTeams={match.teams} />
        ))}
      </div>
      {/* Hover SHAP Visualization */}
      

    </div>
    {createPortal(hoverContent, document.body)} {/* Render hover content at root */}

    </div>
  );
};

export default BracketMatch;
