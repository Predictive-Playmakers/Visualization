import { useState, useEffect, CSSProperties  } from "react";
import { Trophy, Sparkles as Wand, RotateCcw, ChartNoAxesCombined , Ban  } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Plot from "react-plotly.js";
import BracketGroup from "./components/BracketGroup";
import FinalMatches from "./components/FinalMatches";
import StatisticsModal from "@/components/StatisticsModal";
import TeamPreview from "@/components/TeamPreview";

import { calculateBracketDimensions } from "./utils/bracketCalculations";
import { generateDummyBracket, predictWinner } from "./utils";
import startingBracketData from './utils/startingData.json';
import ClipLoader from "react-spinners/ClipLoader";
import MoonLoader from "react-spinners/ClipLoader";
import { BarLoader } from "react-spinners";

const TournamentLayout = () => {
  
  const [bracketData, setBracketData] = useState(startingBracketData);
  const [progress, setProgress] = useState(0); // Initial progress is 0%

  const [activeTeam, setActiveTeam] = useState(null);
  const [isPredicted, setIsPredicted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false)
  const [color, setColor] = useState("#ffffff")


  if (!isPredicted) {

    console.log("initial bracket data:" ,bracketData)

  }

  const correctSeeds = {
    1: 1, 2: 16, 3: 8, 4: 9, 5:5, 6: 12, 7:4, 8:13, 9:6, 10:11, 11:3, 12:14, 13:7, 14:10, 15:2, 16:15,
    17: 1, 18:16, 19: 8, 20:9, 21:5, 22: 12, 23:4, 24:13, 25:6, 26:11, 27:3, 28:14, 29:7, 30:10, 31:2, 32:15,
    33: 1, 34:16, 35: 8, 36:9, 37:5, 38: 12, 39:4, 40:13, 41:6, 42:11, 43:3, 44:14, 45:7, 46:10, 47:2, 48:15,
    49: 1, 50:16, 51: 8, 52:9, 53:5, 54: 12, 55:4, 56:13, 57:6, 58:11, 59:3, 60:14, 61:7, 62:10, 63:2, 64:15,
  }

  const swapSeedsStartingBracket = (bracket, correctSeeds) => {
    for (let divisionKey in bracket) {
      const division = bracket[divisionKey];
  
      for (let roundKey in division) {
        const round = division[roundKey];
  
        // Handle rounds that are arrays (e.g., "round0", "round1", etc.)
        if (Array.isArray(round)) {
          round.forEach(match => {
            // Iterate over each team in the match
            match.teams.forEach(team => {
              if (team.seed !== null && team.seed !== undefined) {
                const newSeed = correctSeeds[team.seed];
                if (newSeed !== undefined) {
                  team.seed = newSeed;
                }
              }
            });
          });
        } else if (typeof round === 'object' && round !== null) {
          // Handle cases where the round is an object (e.g., "championship")
          const match = round;
          match.teams.forEach(team => {
            if (team.seed !== null && team.seed !== undefined) {
              const newSeed = correctSeeds[team.seed];
              if (newSeed !== undefined) {
                team.seed = newSeed;
              }
            }
          });
        }
      }
    }
    
    console.log("bracket after seed swap before sending request", bracket)
    return bracket;
  }


  const swapSeedsPredictedBracket =(data, correctSeeds) => {
    for (const division in data.results) {
      for (const round in data.results[division]) {
        data.results[division][round].forEach((match) => {
          // Swap seeds for Team A and Team B
          match.teams.forEach((team) => {
            if (team.seed in correctSeeds) {
              team.seed = correctSeeds[team.seed];
            }
          });
        });
      }
    }
    console.log("bracket after seed swap before sending request", data)
    return data;


  }

  // variables
  const dimensions = calculateBracketDimensions(16);
  const bracketWidth = dimensions.width / 2 + 50;
  const bracketHeight = dimensions.height - 50;

  useEffect(() => {
    const totalTime = 10000; // total expected time in milliseconds (10 seconds)
    const updateInterval = 100; // update progress every 100ms
    const increment = 100 / (totalTime / updateInterval); // calculate increment per interval
  
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + increment;
        return nextProgress >= 100 ? 99 : nextProgress; // cap progress at 99%
      });
    }, updateInterval);
  
    return () => clearInterval(interval); // Clean up the interval
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "green",
  };


  const sanitizeBrackets = (brackets) => {
    const tempBrackets = isPredicted ? swapSeedsPredictedBracket(brackets, correctSeeds) : swapSeedsStartingBracket(brackets, correctSeeds) 
    return JSON.parse(JSON.stringify(tempBrackets));
  };

  const retrievePredictions = async (brackets) => {
    const endpoint = 'https://predict-bracket-198844576431.us-east4.run.app';
    console.log("brackets line 43:", brackets)

    const sanitizedBrackets = sanitizeBrackets(brackets);
    console.log("sanitizedBrackets", sanitizedBrackets)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ starting_bracket: sanitizedBrackets }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedBrackets = await response.json();
      return updatedBrackets.results;
      
    } catch (error) {
      console.error('Error predicting winner:', error);
      throw error;
    }
  };

  const dummyShapData = {
    featureNames: ["sex", "age", "Pclass", "SibSp", "Parch"],
    features: {
      "0": { effect: 0.18, value: "female" },
      "1": { effect: 0.08, value: 29 },
      "2": { effect: 0.12, value: 1 },
      "3": { effect: -0.03, value: 0 },
      "4": { effect: -0.01, value: 2 },
    },
    baseValue: 0.356,
    outValue: 0.690,
  };


  console.log(bracketData);
 
  const handleDragStart = (event) => {
    // if (isPredicted) return;
    console.log("Drag start:", event.active.data.current);
    setActiveTeam(event.active.data.current.team);
  };

  const handleDragEnd = (event) => {
    // if (isPredicted) return;
    const { active, over } = event;
    console.log("Drag end:", { active, over });

    if (!over) {
      setActiveTeam(null);
      return;
    }

    const sourceData = active.data.current;
    const targetData = over.data.current;

    if (sourceData.divisionId !== targetData.divisionId) {
      setActiveTeam(null);
      return;
    }

    setBracketData((prev) => {
      const newData = { ...prev };
      const division = newData[sourceData.divisionId];
      const newRound0 = [...division.round0];

      // Find matches containing source and target teams
      const sourceMatchIndex = newRound0.findIndex((match) =>
        match.teams.some((team) => team.seed === sourceData.team.seed),
      );

      const targetMatchIndex = newRound0.findIndex((match) =>
        match.teams.some((team) => team.seed === targetData.team.seed),
      );

      if (sourceMatchIndex === -1 || targetMatchIndex === -1) {
        return prev;
      }

      const sourceMatch = { ...newRound0[sourceMatchIndex] };
      const targetMatch = { ...newRound0[targetMatchIndex] };

      // Find team indices
      const sourceTeamIndex = sourceMatch.teams.findIndex(
        (team) => team.seed === sourceData.team.seed,
      );
      const targetTeamIndex = targetMatch.teams.findIndex(
        (team) => team.seed === targetData.team.seed,
      );

      // Handle swapping within the same match
      if (sourceMatchIndex === targetMatchIndex) {
        const newTeams = [...sourceMatch.teams];
        // Directly swap the positions within the same match
        [newTeams[sourceTeamIndex], newTeams[targetTeamIndex]] = [
          newTeams[targetTeamIndex],
          newTeams[sourceTeamIndex],
        ];

        newRound0[sourceMatchIndex] = { ...sourceMatch, teams: newTeams };
      } else {
        // Handle swapping between different matches (existing logic)
        const newSourceTeams = [...sourceMatch.teams];
        const newTargetTeams = [...targetMatch.teams];

        // Swap the teams
        const temp = { ...newSourceTeams[sourceTeamIndex] };
        newSourceTeams[sourceTeamIndex] = {
          ...newTargetTeams[targetTeamIndex],
        };
        newTargetTeams[targetTeamIndex] = temp;

        // Update the matches with new teams
        newRound0[sourceMatchIndex] = { ...sourceMatch, teams: newSourceTeams };
        newRound0[targetMatchIndex] = { ...targetMatch, teams: newTargetTeams };
      }

      // Update the division with new round0
      newData[sourceData.divisionId] = {
        ...division,
        round0: newRound0,
      };
      return newData;
    });

    setActiveTeam(null);
  };

  const handleBracketReset = () => {
    setIsPredicted(false);
    setError(null);
    setLoading(false);
    setBracketData(startingBracketData)
  };

  const handlePredictWinner = async (brackets) => {
    setLoading(true); // Start loading spinner
    setError(null); // Clear any previous errors
    
    try {
      const results = await retrievePredictions(brackets);
      setBracketData(results); // Update state with the returned data
      setIsPredicted(true)
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message); // Display error message if needed
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  const viewportWidth = Math.max(1440, window.innerWidth);
  const isLaptop = viewportWidth < 1920;

  const brackets = [
    {
      id: 1,
      title: "North",
      xOffset: 0,
      side: "left",
      data: bracketData.division0,
      divisionId: "division0",
    },
    {
      id: 2,
      title: "West",
      xOffset: 0,
      yOffset: bracketHeight + 50,
      side: "left",
      data: bracketData.division1,
      divisionId: "division1",
    },
    {
      id: 3,
      title: "East",
      xOffset: bracketWidth + 140,
      side: "right",
      data: bracketData.division2,
      divisionId: "division2",
    },
    {
      id: 4,
      title: "South",
      xOffset: bracketWidth + 140,
      yOffset: bracketHeight + 50,
      side: "right",
      data: bracketData.division3,
      divisionId: "division3",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-[32px] 2xl:px-[36px] py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartNoAxesCombined  className="w-6 h-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-gray-800">
                Predictive Playmakers
              </h1>
            </div>
            <div className="flex gap-x-2">
            <button
                onClick={handleBracketReset}
                className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                <RotateCcw className="w-4 h-4 text-white mr-1.5" />
                Reset Brackets
              </button>
             
              <button
                onClick={() => handlePredictWinner(bracketData)}
                className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                <Wand className="w-4 h-4 text-white mr-1.5" />
                Predict winner
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="">
        {isLoading ? ( // Render spinner or default text when loading
           <div className="flex flex-col items-center justify-center min-h-screen">
           <MoonLoader size={100} color={"#123abc"} loading={true} />
           <p className="mt-4 text-lg font-semibold text-gray-600">
             Fetching Data From Model... {progress}%
           </p>
         </div>
        ) : error ? ( // Show error message if there is one
          
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <Ban >error </Ban>
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <main
              className="relative w-full overflow-y-hidden overflow-x-auto bg-gray-50 pt-16"
              style={{
                overflow: 'visible', // Allow hover box to appear outside
                position: 'relative', // Ensure stacking context for z-index
              }}
            >
              <div
                className="absolute transform -translate-x-1/2 left-1/2"
                style={{
                  top: isLaptop ? bracketHeight - 58 : bracketHeight - 100,
                  width: '800px',
                }}
              >
                <FinalMatches data={bracketData.finals} isPredicted={isPredicted} />
              </div>
              <div
                className="min-h-[2500px]"
                style={{
                  width: bracketWidth * 2 + 300,
                }}
              >
                {brackets.map((bracket) => {
                  console.log("bracket", bracket)
                  return (<div
                    key={bracket.id}
                    className="absolute"
                    style={{
                      left: bracket.xOffset,
                      top: bracket.yOffset || 0,
                    }}
                  >
                    <BracketGroup
                      side={bracket.side}
                      data={bracket.data}
                      divisionId={bracket.divisionId}
                      activeTeam={activeTeam}
                      shapData={dummyShapData}
                      isPredicted={isPredicted}
                    />
                  </div>)
                })                  
                })
              </div>
            </main>
            <DragOverlay dropAnimation={null}>
              {activeTeam && <TeamPreview team={activeTeam} />}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default TournamentLayout;
