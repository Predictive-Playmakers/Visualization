export const generateDummyBracket = (divisions = 4) => {
  const generateTeams = (round, startIndex, divisionIndex) => {
    const matches = [];
    const teamsPerMatch = 8; // 8 matches per division in first round
    for (let i = 0; i < teamsPerMatch; i++) {
      const teamIndex1 = startIndex + i * 2;
      const teamIndex2 = startIndex + i * 2 + 1;
      // Calculate unique seeds based on division
      const seedOffset = divisionIndex * 16; // Each division has 16 teams
      const seed1 = i * 2 + 1 + seedOffset;
      const seed2 = i * 2 + 2 + seedOffset;

      // Determine the group based on the team index
      const getGroup = (index) => {
        if (index < 16) return "A";
        if (index < 32) return "B";
        if (index < 48) return "C";
        return "D";
      };

      matches.push({
        id: `${round}-${i}`,
        teams: [
          {
            name: `Team ${teamIndex1 + 1}`,
            // seed: seed1,
            seed: teamIndex1 + 1,
            score: 0,
            group: getGroup(teamIndex1),
          },
          {
            name: `Team ${teamIndex2 + 1}`,
            // seed: seed2,
            seed: teamIndex2 + 1,
            score: 0,
            group: getGroup(teamIndex2),
          },
        ],
      });
    }
    return matches;
  };

  const generateEmptyMatches = (round, count) => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        id: `${round}-${i}`,
        teams: [
          { name: "", seed: null, score: 0 },
          { name: "", seed: null, score: 0 },
        ],
      }));
  };

  // Generate initial bracket data for each division
  const brackets = {};
  for (let d = 0; d < divisions; d++) {
    const startIndex = d * 16; // Each division starts with a new set of team numbers
    brackets[`division${d}`] = {
      round0: generateTeams(0, startIndex, d),
      round1: generateEmptyMatches(1, 4),
      round2: generateEmptyMatches(2, 2),
      round3: generateEmptyMatches(3, 1),
    };
  }

  // Add semifinals and finals
  brackets.finals = {
    semifinals: [
      {
        id: "sf-1",
        teams: [
          { name: "", seed: null, score: 0 },
          { name: "", seed: null, score: 0 },
        ],
      },
      {
        id: "sf-2",
        teams: [
          { name: "", seed: null, score: 0 },
          { name: "", seed: null, score: 0 },
        ],
      },
    ],
    championship: {
      id: "final",
      teams: [
        { name: "", seed: null, score: 0 },
        { name: "", seed: null, score: 0 },
      ],
    },
  };

  return brackets;
};
