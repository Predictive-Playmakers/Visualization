import React, { useState } from 'react';
import { Settings, Users, Save, Download } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  seed: number;
  conference: number;
  scores: Record<string, number>;
}

interface TeamCardProps {
  team: Team | null;
  roundName: string;
  index: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, team: Team, roundName: string, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' }> = ({
  children,
  className = '',
  variant,
  ...props
}) => {
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        variant === 'outline'
          ? 'border border-gray-300 hover:bg-gray-50'
          : 'bg-primary text-white hover:bg-primary/90'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TeamCard: React.FC<TeamCardProps> = ({ team, roundName, index, onDragStart, onDragEnd }) => {
  return (
    <div
      id={`${roundName}-${index}`}
      draggable={!!team}
      onDragStart={(e) => team && onDragStart(e, team, roundName, index)}
      onDragEnd={onDragEnd}
      className="relative w-[200px]"
    >
      <Card
        className={`p-2 ${
          team ? 'hover:bg-gray-50 cursor-move' : 'bg-gray-100'
        } ${team?.conference === 1 ? 'border-blue-500' : 'border-green-500'}`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">
              {team ? `${team.name}` : 'Empty'}
            </span>
            {team && (
              <span className="text-xs text-gray-500">#{team.seed}</span>
            )}
          </div>
          {team?.scores?.[roundName] && (
            <div className="text-xs text-gray-500">
              Score: {team.scores[roundName]}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface MatchupProps {
  teams: (Team | null)[];
  roundName: string;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    team: Team,
    roundName: string,
    index: number
  ) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Matchup: React.FC<MatchupProps> = ({
  teams,
  roundName,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <TeamCard
        team={teams[0]}
        roundName={roundName}
        index={0}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      <TeamCard
        team={teams[1]}
        roundName={roundName}
        index={1}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </div>
  );
};

interface RoundProps {
  roundName: string;
  teams: (Team | null)[];
  isRight: boolean;
  offset: number;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    team: Team,
    roundName: string,
    index: number
  ) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, roundName: string, index: number) => void;
}

const Round: React.FC<RoundProps> = ({
  roundName,
  teams,
  isRight,
  offset,
  onDragStart,
  onDragEnd,
  onDrop,
}) => {
  const pairs = [];
  for (let i = 0; i < teams.length; i += 2) {
    pairs.push(teams.slice(i, i + 2));
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-100');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-100');
  };

  return (
    <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} gap-8`}>
      {pairs.map((pair, idx) => (
        <div
          key={idx}
          className={`relative p-2 ${isRight ? 'items-end' : 'items-start'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => onDrop(e, roundName, offset + idx * 2)}
        >
          <Matchup
            teams={pair}
            roundName={roundName}
            onDragStart={(e, team, roundName, index) =>
              onDragStart(e, team, roundName, offset + idx * 2 + index)
            }
            onDragEnd={onDragEnd}
          />
        </div>
      ))}
    </div>
  );
};

const TournamentBracket: React.FC = () => {
  const [rounds, setRounds] = useState({
    round1: [
      { id: 'EAST-1', name: 'UConn', seed: 1, conference: 1, scores: { round1: 91 } },
      { id: 'EAST-16', name: 'Stetson', seed: 16, conference: 1, scores: { round1: 52 } },
      { id: 'EAST-8', name: 'FAU', seed: 8, conference: 1, scores: { round1: 65 } },
      { id: 'EAST-9', name: 'Northwestern', seed: 9, conference: 1, scores: { round1: 77 } },
      { id: 'EAST-5', name: 'San Diego St', seed: 5, conference: 1, scores: { round1: 69 } },
      { id: 'EAST-12', name: 'UAB', seed: 12, conference: 1, scores: { round1: 65 } },
      { id: 'EAST-4', name: 'Auburn', seed: 4, conference: 1, scores: { round1: 76 } },
      { id: 'EAST-13', name: 'Yale', seed: 13, conference: 1, scores: { round1: 78 } },
      { id: 'WEST-1', name: 'North Carolina', seed: 1, conference: 2, scores: { round1: 90 } },
      { id: 'WEST-16', name: 'Wagner', seed: 16, conference: 2, scores: { round1: 62 } },
      { id: 'WEST-8', name: 'Mississippi St', seed: 8, conference: 2, scores: { round1: 51 } },
      { id: 'WEST-9', name: 'Michigan St', seed: 9, conference: 2, scores: { round1: 69 } },
      { id: 'WEST-5', name: 'Saint Mary\'s', seed: 5, conference: 2, scores: { round1: 66 } },
      { id: 'WEST-12', name: 'Grand Canyon', seed: 12, conference: 2, scores: { round1: 75 } },
      { id: 'WEST-4', name: 'Alabama', seed: 4, conference: 2, scores: { round1: 109 } },
      { id: 'WEST-13', name: 'New Mexico', seed: 13, conference: 2, scores: { round1: 56 } },
    ],
    round2: Array(8).fill(null),
    round3: Array(4).fill(null),
    round4: Array(2).fill(null),
    final: Array(1).fill(null),
  });

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    team: Team,
    roundName: string,
    index: number
  ) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        team,
        sourceRound: roundName,
        sourceIndex: index,
      })
    );
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetRound: string,
    targetIndex: number
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-100');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { team, sourceRound, sourceIndex } = data;

      if (sourceRound === targetRound && sourceIndex === targetIndex) return;

      // Ensure the team is advancing to the correct slot
      const expectedTargetIndex = Math.floor(sourceIndex / 2);
      if (targetIndex !== expectedTargetIndex) {
        alert('You can only advance teams to the correct next slot.');
        return;
      }

      const newRounds = { ...rounds };
      newRounds[targetRound] = [...newRounds[targetRound]];

      // Prevent overwriting if a team is already in the target slot
      if (newRounds[targetRound][targetIndex]) {
        alert('This slot is already occupied.');
        return;
      }

      newRounds[targetRound][targetIndex] = {
        ...team,
        scores: {
          ...team.scores,
          [targetRound]: team.scores[sourceRound], // Copy score from previous round or handle appropriately
        },
      };

      setRounds(newRounds);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">March Madness 2024</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users size={16} />
                Collaborators
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Tournament Bracket</h2>
            <p className="text-sm text-gray-500">Drag teams to advance them</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Save size={16} />
              Save
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
          <div className="flex justify-center min-w-[1200px] gap-16">
            <div className="flex gap-16">
              {['round1', 'round2'].map((roundName, idx) => (
                <Round
                  key={roundName}
                  roundName={roundName}
                  teams={rounds[roundName].slice(0, rounds[roundName].length / 2)}
                  isRight={false}
                  offset={0}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">Championship</h3>
              <Round
                roundName="final"
                teams={rounds.final}
                isRight={false}
                offset={0}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            </div>

            <div className="flex gap-16">
              {['round2', 'round1'].map((roundName, idx) => (
                <Round
                  key={roundName}
                  roundName={roundName}
                  teams={rounds[roundName].slice(rounds[roundName].length / 2)}
                  isRight={true}
                  offset={rounds[roundName].length / 2}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span>East Region</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
              <span>West Region</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TournamentBracket;
