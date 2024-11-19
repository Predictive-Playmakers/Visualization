export const predictWinner = (brackets) => {
  const generateScores = (winner) => {
    // Generate a random score for the winner between 60 and 100
    const winnerScore = Math.floor(Math.random() * 41) + 60;
    // Generate a random score for the loser that's less than winner's score
    const loserScore = Math.floor(Math.random() * (winnerScore - 10)) + 10;
    return { winnerScore, loserScore };
  };

  const simulateMatch = (team1, team2) => {
    // Simple simulation based on seed numbers (lower seed has better chance)
    const team1Chance = team2.seed / (team1.seed + team2.seed);
    const winner = Math.random() < team1Chance ? team1 : team2;
    const loser = winner === team1 ? team2 : team1;
    // Generate scores
    const { winnerScore, loserScore } = generateScores(winner);
    // Return both teams with updated scores
    return {
      winner: { ...winner, score: winnerScore },
      loser: { ...loser, score: loserScore },
    };
  };

  const simulateDivision = (divisionBracket) => {
    const result = JSON.parse(JSON.stringify(divisionBracket));

    // Simulate and update scores for Round 0 (first round)
    const simulatedRound0 = result.round0.map((match) => {
      const matchResult = simulateMatch(match.teams[0], match.teams[1]);
      return {
        ...match,
        teams: [
          matchResult.winner.name === match.teams[0].name
            ? matchResult.winner
            : matchResult.loser,
          matchResult.winner.name === match.teams[1].name
            ? matchResult.winner
            : matchResult.loser,
        ],
      };
    });
    result.round0 = simulatedRound0;

    // Simulate Round of 16
    result.round1 = result.round1.map((match, i) => {
      const match1 = simulateMatch(
        result.round0[i * 2].teams[0],
        result.round0[i * 2].teams[1],
      );
      const match2 = simulateMatch(
        result.round0[i * 2 + 1].teams[0],
        result.round0[i * 2 + 1].teams[1],
      );
      return {
        ...match,
        teams: [match1.winner, match2.winner],
      };
    });

    // Simulate Quarter Finals
    result.round2 = result.round2.map((match, i) => {
      const matchResult = simulateMatch(
        result.round1[i * 2].teams[0],
        result.round1[i * 2].teams[1],
      );
      const match2Result = simulateMatch(
        result.round1[i * 2 + 1].teams[0],
        result.round1[i * 2 + 1].teams[1],
      );
      return {
        ...match,
        teams: [matchResult.winner, match2Result.winner],
      };
    });

    // Simulate Semi Finals
    result.round3 = result.round3.map((match, i) => {
      const matchResult = simulateMatch(
        result.round2[i * 2].teams[0],
        result.round2[i * 2].teams[1],
      );
      return {
        ...match,
        teams: [matchResult.winner, matchResult.loser],
      };
    });
    return result;
  };

  // Simulate each division
  const result = { ...brackets };
  const divisionWinners = [];
  Object.keys(result).forEach((key) => {
    if (key !== "finals") {
      result[key] = simulateDivision(result[key]);
      divisionWinners.push(result[key].round3[0].teams[0]);
    }
  });

  // Simulate Finals
  // Semi-finals
  const semiFinal1 = simulateMatch(divisionWinners[0], divisionWinners[1]);
  const semiFinal2 = simulateMatch(divisionWinners[2], divisionWinners[3]);
  // Championship
  const championship = simulateMatch(semiFinal1.winner, semiFinal2.winner);

  result.finals = {
    semifinals: [
      {
        id: "sf-1",
        teams: [semiFinal1.winner, semiFinal1.loser],
      },
      {
        id: "sf-2",
        teams: [semiFinal2.winner, semiFinal2.loser],
      },
    ],
    championship: {
      id: "final",
      teams: [championship.winner, championship.loser],
    },
  };

  return result;
};
