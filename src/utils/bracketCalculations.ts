// bracketCalculations.ts

// Base sizes for 1920px width
const BASE_MATCH_WIDTH = 200;
const BASE_MATCH_HEIGHT = 67;
const BASE_HORIZONTAL_GAP = 20;
const BASE_CANVAS_PADDING = 30;

// Calculate scale factor based on viewport width
const getScaleFactor = () => {
  const viewportWidth = Math.max(1440, window.innerWidth);
  return viewportWidth < 1920 ? (viewportWidth - 48) / 1920 : 1;
};

// Responsive dimensions
export const getResponsiveDimensions = () => {
  const scale = getScaleFactor();
  return {
    MATCH_WIDTH: Math.floor(BASE_MATCH_WIDTH * scale),
    MATCH_HEIGHT: Math.floor(BASE_MATCH_HEIGHT),
    HORIZONTAL_GAP: Math.floor(BASE_HORIZONTAL_GAP * scale),
    CANVAS_PADDING: Math.floor(BASE_CANVAS_PADDING * scale),
  };
};

// Calculate vertical starting point for each column
const calculateVerticalStart = (columnIndex: number, height: number) =>
  Math.pow(2, columnIndex) * (height / 2) - height / 2;

// Calculate vertical increment for each column
const calculateVerticalIncrement = (columnIndex: number, height: number) =>
  Math.pow(2, columnIndex) * height;

export const calculateBracketDimensions = (totalTeams: number) => {
  const { MATCH_WIDTH, MATCH_HEIGHT, HORIZONTAL_GAP, CANVAS_PADDING } =
    getResponsiveDimensions();
  const rounds = Math.log2(totalTeams);
  const totalWidth = (rounds + 1) * (MATCH_WIDTH + HORIZONTAL_GAP);
  const firstRoundMatches = totalTeams / 2;
  const totalHeight = firstRoundMatches * MATCH_HEIGHT * 2;

  return {
    width: totalWidth + CANVAS_PADDING * 2,
    height: totalHeight + CANVAS_PADDING * 2,
    rounds: rounds,
  };
};

export const calculateMatchPosition = (
  round: number,
  matchIndex: number,
  totalTeams: number,
  side: string = "left",
) => {
  const { MATCH_WIDTH, MATCH_HEIGHT, HORIZONTAL_GAP, CANVAS_PADDING } =
    getResponsiveDimensions();
  const totalRounds = Math.log2(totalTeams);
  const roundWidth = MATCH_WIDTH + HORIZONTAL_GAP;

  let x;
  if (side === "left") {
    x = round * roundWidth + CANVAS_PADDING;
  } else {
    x = totalRounds * roundWidth - round * roundWidth + CANVAS_PADDING;
  }

  const verticalStart = calculateVerticalStart(round, MATCH_HEIGHT * 2);
  const verticalIncrement = calculateVerticalIncrement(round, MATCH_HEIGHT * 2);
  const y =
    verticalStart + matchIndex * verticalIncrement + CANVAS_PADDING + 40;

  return { x, y };
};
