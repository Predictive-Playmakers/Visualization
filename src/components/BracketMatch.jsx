import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { getResponsiveDimensions } from "../utils/bracketCalculations";

const TeamCard = ({
  team,
  isDragging = false,
  isDropTarget = false,
  isTopTeam,
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
      style={{ minHeight }}
    >
      <div className="w-7 h-7 flex items-center justify-center bg-blue-50 rounded text-xs font-medium text-blue-600">
        {team?.seed || "-"}
      </div>
      <span className="text-xs 2xl:text-sm ml-1 2xl:ml-3 font-medium text-gray-900 truncate">
        {team?.name || "TBD"}
      </span>
      <span className="text-xs 2xl:text-sm text-gray-400 ml-1">
        {team?.seed}
      </span>
      {team.score !== undefined && (
        <span className="text-xs 2xl:text-sm ml-auto text-gray-400 mr-0.5 2xl:mr-1">
          {team.score}
        </span>
      )}
    </div>
  );
};

const BracketMatch = ({ match, roundNumber, divisionId, activeTeam }) => {
  const { MATCH_WIDTH } = getResponsiveDimensions();

  const TeamSlot = ({ team, index }) => {
    if (roundNumber !== 0) {
      return <TeamCard team={team} isTopTeam={index === 0} />;
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
          team={team}
          isDragging={isDragging}
          isDropTarget={isDropTarget}
          isTopTeam={index === 0}
        />
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      style={{ width: MATCH_WIDTH }}
    >
      <div className="divide-y divide-gray-100">
        {match.teams.map((team, index) => (
          <TeamSlot key={index} team={team} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BracketMatch;
