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

  const correctShapData = match.shap
  // Initialize statistics variables
  let TeamA_Avg_Points, TeamA_Efficiency_Rating, TeamA_Turnover_Ratio, TeamA;
  let TeamB_Avg_Points, TeamB_Efficiency_Rating, TeamB_Turnover_Ratio, Winner, TeamB;
    if (isPredicted && match){

    TeamA = match["result"].TeamA;
    TeamB = match["result"].TeamB;
    TeamA_Avg_Points = match["result"]["TeamA_Avg Points Per Game: "];
    TeamA_Efficiency_Rating = match["result"]["TeamA_Efficiency Rating: "];
    TeamA_Turnover_Ratio = match["result"]["TeamA_Turnover Ratio: "];
    TeamB_Avg_Points = match["result"]["TeamB_Avg Points Per Game: "];
    TeamB_Efficiency_Rating = match["result"]["TeamB_Efficiency Rating: "];
    TeamB_Turnover_Ratio = match["result"]["TeamB_Turnover Ratio: "];
    Winner = match["result"]["Winner"];
  }
  
  const plotData = correctShapData && isPredicted

  ? {
      data: [
        {
          type: "bar",
          x: Object.values(correctShapData["data"]["0"]["features"]).map((f) => f.effect), // SHAP effects
          y: correctShapData["data"]["0"]["featureNames"], // Feature names
          orientation: "h",
          marker: {
            color: Object.values(correctShapData["data"]["0"]["features"]).map((e) =>
              e.effect > 0 ? "green" : "red"
            ),
          },
        },
      ],
      layout: {
        title: `Feature Contributions (Base: ${correctShapData["data"]["0"]["baseValue"].toFixed(
          3
        )}, Output: ${correctShapData["data"]["0"]["outValue"].toFixed(3)})`,
        yaxis: { title: "Feature", automargin: true },
        margin: { l: 200, r: 50, t: 50, b: 50 }, // Increased left margin for longer feature names
        height: 500, // Larger plot height
        width: 500,  // Larger plot width
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
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        border: "2px solid lightgray", // Optional, more noticeable border
      }}
    >
      <Plot data={plotData.data} layout={plotData.layout} style={{ width: "100%", height: "400px" }} />

      {/* Statistics Section */}
<div className="mt-4 text-sm">
  <h3 className="font-semibold text-gray-800 mb-3 text-center">Match Statistics</h3>
  <div className="grid grid-cols-2 gap-4 text-gray-700">
    {/* Team Names */}
    <div className="col-span-2 flex justify-between items-center border-b pb-2">
      <span className="font-semibold">Team A:</span>
      <span className="text-gray-900">{TeamA}</span>
    </div>
    <div className="col-span-2 flex justify-between items-center border-b pb-2">
      <span className="font-semibold">Team B:</span>
      <span className="text-gray-900">{TeamB}</span>
    </div>

    {/* Statistics for Team A */}
    <div className="flex justify-between items-center">
      <span>Avg Points:</span>
      <span className="font-medium text-blue-600">{TeamA_Avg_Points}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Avg Points:</span>
      <span className="font-medium text-blue-600">{TeamB_Avg_Points}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Turnover Ratio:</span>
      <span className="font-medium text-red-500">{TeamA_Turnover_Ratio}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Turnover Ratio:</span>
      <span className="font-medium text-red-500">{TeamB_Turnover_Ratio}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Efficiency Rating:</span>
      <span className="font-medium text-green-500">{TeamA_Efficiency_Rating}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Efficiency Rating:</span>
      <span className="font-medium text-green-500">{TeamB_Efficiency_Rating}</span>
    </div>

    {/* Winner */}
    <div className="mt-5 text-center border-t pt-3 flex flex-col items-center">
    <span className="font-semibold text-lg text-gray-800">Winner:</span>
    <div className="font-extrabold text-2xl text-indigo-700 mt-2">
      {Winner}
    </div>
  </div>
  </div>
</div>
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
