'use client'
import { LocalPlayer, Card, Category } from '@/types/game'
import { MiniCard } from '@/components/GameCard'
import { cardType, choicesFor, turnPlayerVotes } from '@/lib/game/cardTypes'

interface Props {
  card: Card | null
  category?: Category
  players: LocalPlayer[]
  currentPlayer: LocalPlayer | null
  votes: Record<string, string>
  onCastVote: (voterName: string, votedForName: string) => void
  onResolve: () => void
  allVotesCast: boolean
}

const HEADINGS = {
  quien: { title: '¡A votar!', hint: 'Marcá el voto de cada jugador', verb: 'vota a:' },
  preferis: { title: '¿Qué prefiere cada uno?', hint: 'La minoría se lleva la carta', verb: 'prefiere:' },
  yo_nunca: { title: '¿Quién lo hizo?', hint: 'La minoría se lleva la carta', verb: '' },
}

export default function VotingPanel({ card, category, players, currentPlayer, votes, onCastVote, onResolve, allVotesCast }: Props) {
  const type = cardType(card)
  const heading = HEADINGS[type]
  // En "¿Quién...?" vota todo el resto; en "¿Qué preferís?" y "Yo nunca" contestan todos
  const voters = turnPlayerVotes(card) ? players : players.filter(p => p.name !== currentPlayer?.name)

  const choices = card && type !== 'quien' ? choicesFor(card) : null

  function optionsFor(voter: LocalPlayer) {
    return choices ?? players.filter(p => p.name !== voter.name).map(p => ({ value: p.name, label: p.name }))
  }

  function badge(value: string) {
    if (!choices) return value
    if (type === 'preferis') return value.toUpperCase()
    return choices.find(c => c.value === value)?.label ?? value
  }

  return (
    <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black mb-1">{heading.title}</h2>
        <p className="text-[#888] text-sm">{heading.hint}</p>
      </div>

      {card && <MiniCard card={card} category={category} />}

      <div className="text-center text-sm text-[#888]">
        {Object.keys(votes).length} de {voters.length} votos registrados
      </div>

      {voters.map(voter => (
        <div key={voter.name} className="card-surface p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">{voter.name}</span>
            {heading.verb && <span className="text-[#888] text-sm">{heading.verb}</span>}
            {votes[voter.name] && (
              <span className="ml-auto text-xs bg-[#c8ff00]/20 text-[#c8ff00] px-2 py-1 rounded-lg font-semibold">
                {badge(votes[voter.name])} ✓
              </span>
            )}
          </div>
          <div className={`flex gap-2 ${type === 'preferis' ? 'flex-col' : 'flex-wrap'}`}>
            {optionsFor(voter).map((option, i) => (
              <button
                key={option.value}
                onClick={() => onCastVote(voter.name, option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  type === 'preferis' ? 'text-left' : type === 'yo_nunca' ? 'flex-1' : ''
                } ${
                  votes[voter.name] === option.value
                    ? 'bg-[#c8ff00] text-black border-[#c8ff00]'
                    : 'border-white/20 text-white hover:border-white/50'
                }`}
              >
                {type === 'preferis' && <span className="font-black mr-2">{i === 0 ? 'A' : 'B'}</span>}
                {option.label}
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
