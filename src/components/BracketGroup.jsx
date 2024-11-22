// BracketGroup.jsx
import React from "react";
import {
  calculateMatchPosition,
  calculateBracketDimensions,
} from "../utils/bracketCalculations";
import BracketMatch from "./BracketMatch";
import BracketConnector from "./BracketConnector";

const TOTAL_TEAMS = 16;

const BracketGroup = ({ side = "left", data, divisionId, activeTeam, shapData , isPredicted}) => {
  const { width, height } = calculateBracketDimensions(TOTAL_TEAMS);

  const roundsArray = Object.entries(data)
    .filter(([key]) => key.startsWith("round"))
    .map(([key, matches]) => ({
      round: parseInt(key.replace("round", "")),
      matches,
    }))
    .sort((a, b) => a.round - b.round);

  return (
    <div className="relative z-[1]">
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={width}
        height={height}
        
      >
        {roundsArray.slice(0, -1).map((roundData, round) =>
          roundData.matches.map((match, matchIndex) => {
            const currentPos = calculateMatchPosition(
              round,
              matchIndex,
              TOTAL_TEAMS,
              side,
            );
            const nextRoundPos = calculateMatchPosition(
              round + 1,
              Math.floor(matchIndex / 2),
              TOTAL_TEAMS,
              side,
            );
            return (
              <BracketConnector
                key={`connector-${round}-${matchIndex}`}
                startX={currentPos.x}
                startY={currentPos.y - 33.5}
                endX={nextRoundPos.x}
                endY={nextRoundPos.y - 33.5}
                side={side}
              />
            );
          }),
        )}
      </svg>

      {roundsArray.map((roundData) => (
        <React.Fragment key={`round-${roundData.round}`}>
          {roundData.matches.map((match, matchIndex) => {
            const currentPos = calculateMatchPosition(
              roundData.round,
              matchIndex,
              TOTAL_TEAMS,
              side,
            );

            return (
              <div
                key={match.id || `${roundData.round}-${matchIndex}`}
                className="absolute"
                style={{
                  left: currentPos.x,
                  top: currentPos.y,
                  transform: "translate(0, -50%)",
                }}
              >
                <BracketMatch
                  match={match}
                  roundNumber={roundData.round}
                  divisionId={divisionId}
                  matchIndex={matchIndex}
                  activeTeam={activeTeam}
                  shapData={shapData}
                  isPredicted={isPredicted}                 
                />
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BracketGroup;
