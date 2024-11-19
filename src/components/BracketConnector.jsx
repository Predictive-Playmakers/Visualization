// BracketConnector.jsx
import React from "react";
import { getResponsiveDimensions } from "../utils/bracketCalculations";

const BracketConnector = ({ startX, startY, endX, endY, side }) => {
  const { MATCH_WIDTH, MATCH_HEIGHT } = getResponsiveDimensions();

  let path;
  if (side === "left") {
    const midX = startX + (endX - startX) / 2 + MATCH_WIDTH;
    path = `
      M ${startX + MATCH_WIDTH} ${startY + MATCH_HEIGHT / 2}
      H ${midX}
      V ${endY + MATCH_HEIGHT / 2}
      H ${endX}
    `;
  } else {
    const midX = startX - (startX - endX) / 2;
    path = `
      M ${startX} ${startY + MATCH_HEIGHT / 2}
      H ${midX}
      V ${endY + MATCH_HEIGHT / 2}
      H ${endX}
    `;
  }

  return (
    <path
      d={path}
      stroke="#CBD5E1"
      strokeWidth="2"
      fill="none"
      className="transition-all duration-300"
    />
  );
};

export default BracketConnector;
