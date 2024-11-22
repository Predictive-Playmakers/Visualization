import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { getResponsiveDimensions } from "../utils/bracketCalculations";
import { createPortal } from "react-dom";
import Plot from "react-plotly.js";

const FinalMatches = ({ data, isPredicted, match }) => {
    const correctSeeds = {
      1: 1, 2: 16, 3: 8, 4: 9, 5:5, 6: 12, 7:4, 8:13, 9:6, 10:11, 11:3, 12:14, 13:7, 14:10, 15:2, 16:15,
      17: 1, 18:16, 19: 8, 20:9, 21:5, 22: 12, 23:4, 24:13, 25:6, 26:11, 27:3, 28:14, 29:7, 30:10, 31:2, 32:15,
      33: 1, 34:16, 35: 8, 36:9, 37:5, 38: 12, 39:4, 40:13, 41:6, 42:11, 43:3, 44:14, 45:7, 46:10, 47:2, 48:15,
      49: 1, 50:16, 51: 8, 52:9, 53:5, 54: 12, 55:4, 56:13, 57:6, 58:11, 59:3, 60:14, 61:7, 62:10, 63:2, 64:15,
    }

    const MatchBox = ({ title, teams, isCenter, shapData, match }) => {
      const [isHovered, setIsHovered] = useState(false);
      const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
    
      const { MATCH_WIDTH } = getResponsiveDimensions();
      

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

      console.log("match:", match)
    
      // Initialize statistics variables
      let TeamA_Avg_Points, TeamA_Efficiency_Rating, TeamA_Turnover_Ratio, TeamA;
      let TeamB_Avg_Points, TeamB_Efficiency_Rating, TeamB_Turnover_Ratio, Winner, TeamB;

      const correctShapData = shapData ?  shapData.data[0] : null
      if (isPredicted && match){
      
      
      console.log("shapData.data[0]", shapData.data[0])

      TeamA = match["results"].TeamA;
      TeamB = match["results"].TeamB;
      TeamA_Avg_Points = match["results"]["TeamA_Avg Points Per Game: "];
      TeamA_Efficiency_Rating = match["results"]["TeamA_Efficiency Rating: "];
      TeamA_Turnover_Ratio = match["results"]["TeamA_Turnover Ratio: "];
      TeamB_Avg_Points = match["results"]["TeamB_Avg Points Per Game: "];
      TeamB_Efficiency_Rating = match["results"]["TeamB_Efficiency Rating: "];
      TeamB_Turnover_Ratio = match["results"]["TeamB_Turnover Ratio: "];
      Winner = match["results"]["Winner"];

      console.log("Team A Stats:");
      console.log("Avg Points:", TeamA_Avg_Points);
      console.log("Efficiency Rating:", TeamA_Efficiency_Rating);
      console.log("Turnover Ratio:", TeamA_Turnover_Ratio);
      console.log("Team B Stats:");
      console.log("Avg Points:", TeamB_Avg_Points);
      console.log("Efficiency Rating:", TeamB_Efficiency_Rating);
      console.log("Turnover Ratio:", TeamB_Turnover_Ratio);
      console.log("Winner:", Winner);


     
    }

    const plotData = isPredicted  && correctShapData

      ? {
          data: [
            {
              type: "bar",
              x: Object.values(correctShapData["features"]).map((f) => f.effect), // SHAP effects
              y: correctShapData["featureNames"], // Feature names
              orientation: "h",
              marker: {
                color: Object.values(correctShapData["features"]).map((e) =>
                  e.effect > 0 ? "green" : "red"
                ),
              },
            },
          ],
          layout: {
            title: `Feature Contributions (Base: ${correctShapData["baseValue"].toFixed(
              3
            )}, Output: ${correctShapData["outValue"].toFixed(3)})`,
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




    return (
      <div className="relative z-[1]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        
        <div
      className="bg-white rounded-lg shadow-lg border border-gray-200"
      style={{ width: MATCH_WIDTH }}
    >

      
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
              {correctSeeds[team.seed] || "-"}
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
    </div>
    {createPortal(hoverContent, document.body)} {/* Render hover content at root */}
    </div>
  )};
  
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
        <MatchBox title="Final Four" teams={data.semifinals[0].teams} shapData ={data.semifinals[0].shap} match={data.semifinals[0]} />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-24 scale-[110%]">
        <MatchBox
          title="Championship"
          teams={data.championship.teams}
          isCenter={true}
          shapData ={data.championship.shap}
          match={data.championship}
        />
      </div>

      <div className="absolute right-12 -top-0">
        <MatchBox title="Final Four" teams={data.semifinals[1].teams} shapData ={data.semifinals[1].shap} match={data.semifinals[1]} />
      </div>
    </div>
  );
};

export default FinalMatches;
