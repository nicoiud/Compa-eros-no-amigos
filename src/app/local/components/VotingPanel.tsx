'use client'
import { LocalPlayer } from '@/types/game'

interface Props {
  players: LocalPlayer[]
  currentPlayer: LocalPlayer | null
  votes: Record<string, string>
  onCastVote: (voterName: string, votedForName: string) => void
  onResolve: () => void
  allVotesCast: boolean
}

export default function VotingPanel({ players, currentPlayer, votes, onCastVote, onResolve, allVotesCast }: Props) {
  // Jugadores que tienen que votar (todos menos el que tiene el turno)
  const voters = players.filter(p => p.name !== currentPlayer?.name)

  return (
    <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black mb-1">¡A votar!</h2>
        <p className="text-[#888] text-sm">Marcá el voto de cada jugador</p>
      </div>

      <div className="text-center text-sm text-[#888]">
        {Object.keys(votes).length} de {voters.length} votos registrados
      </div>

      {voters.map(voter => (
        <div key={voter.name} className="card-surface p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">{voter.name}</span>
            <span className="text-[#888] text-sm">vota a:</span>
            {votes[voter.name] && (
              <span className="ml-auto text-xs bg-[#c8ff00]/20 text-[#c8ff00] px-2 py-1 rounded-lg font-semibold">
                {votes[voter.name]} ✓
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {players
              .filter(p => p.name !== voter.name)
              .map(candidate => (
                <button
                  key={candidate.name}
                  onClick={() => onCastVote(voter.name, candidate.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    votes[voter.name] === candidate.name
                      ? 'bg-[#c8ff00] text-black border-[#c8ff00]'
                      : 'border-white/20 text-white hover:border-white/50'
                  }`}
                >
                  {candidate.name}
                </button>
              ))}
          </div>
        </div>
      ))}

      <button
        onClick={onResolve}
        disabled={!allVotesCast}
        className="btn-primary text-lg py-4 mt-auto"
      >
        Ver resultados
      </button>
    </div>
  )
}
