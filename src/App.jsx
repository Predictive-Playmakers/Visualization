import { useState } from "react";
import { Trophy, Sparkles as Wand } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import BracketGroup from "./components/BracketGroup";
import FinalMatches from "./components/FinalMatches";
import StatisticsModal from "@/components/StatisticsModal";
import TeamPreview from "@/components/TeamPreview";

import { calculateBracketDimensions } from "./utils/bracketCalculations";
import { generateDummyBracket, predictWinner } from "./utils";

const TournamentLayout = () => {
  const [bracketData, setBracketData] = useState(generateDummyBracket(4));
  const dimensions = calculateBracketDimensions(16);
  const bracketWidth = dimensions.width / 2 + 50;
  const bracketHeight = dimensions.height - 50;

  const [activeTeam, setActiveTeam] = useState(null);
  const [isPredicted, setIsPredicted] = useState(false);

  console.log(bracketData);

  const handleDragStart = (event) => {
    if (isPredicted) return;
    console.log("Drag start:", event.active.data.current);
    setActiveTeam(event.active.data.current.team);
  };

  const handleDragEnd = (event) => {
    if (isPredicted) return;
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

  const handlePredictWinner = () => {
    setIsPredicted(true);
    setBracketData(predictWinner(bracketData));
  };

  const viewportWidth = Math.max(1440, window.innerWidth);
  const isLaptop = viewportWidth < 1920;

  const brackets = [
    {
      id: 1,
      title: "Men's Division A",
      xOffset: 0,
      side: "left",
      data: bracketData.division0,
      divisionId: "division0",
    },
    {
      id: 2,
      title: "Men's Division B",
      xOffset: 0,
      yOffset: bracketHeight + 50,
      side: "left",
      data: bracketData.division1,
      divisionId: "division1",
    },
    {
      id: 3,
      title: "Women's Division A",
      xOffset: bracketWidth + 140,
      side: "right",
      data: bracketData.division2,
      divisionId: "division2",
    },
    {
      id: 4,
      title: "Women's Division B",
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
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-gray-800">
                Tournament Brackets
              </h1>
            </div>
            <div className="flex gap-x-2">
              {isPredicted ? (
                <Dialog>
                  <DialogTrigger>
                    <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Show statistics
                    </button>
                  </DialogTrigger>
                  <StatisticsModal />
                </Dialog>
              ) : (
                <button
                  onClick={handlePredictWinner}
                  className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                  <Wand className="w-4 h-4 text-white mr-1.5" />
                  Predict winner
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <main className="relative w-full overflow-y-hidden overflow-x-auto bg-gray-50 pt-16">
            <div
              className="absolute transform -translate-x-1/2 left-1/2"
              style={{
                top: isLaptop ? bracketHeight - 58 : bracketHeight - 100,
                width: "800px",
              }}
            >
              <FinalMatches data={bracketData.finals} />
            </div>
            <div
              className="min-h-[2500px]"
              style={{
                width: bracketWidth * 2 + 300,
              }}
            >
              {brackets.map((bracket) => (
                <div
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
                  />
                </div>
              ))}
            </div>
          </main>

          <DragOverlay dropAnimation={null}>
            {activeTeam && <TeamPreview team={activeTeam} />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TournamentLayout;
