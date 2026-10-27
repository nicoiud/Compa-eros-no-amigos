'use client'
import { useState } from 'react'
import { RoundResult as RoundResultType, LocalPlayer } from '@/types/game'
import { Category } from '@/types/game'
import CreateCardModal from './CreateCardModal'
import Scoreboard from './Scoreboard'
import { MiniCard } from '@/components/GameCard'
import { RoundHeadline, ChoiceBreakdown } from '@/components/RoundSummary'
import { cardType } from '@/lib/game/cardTypes'

interface Props {
  result: RoundResultType
  players: LocalPlayer[]
  cardsToWin: number
  onNextTurn: () => void
  categories: Category[]
}

export default function RoundResult({ result, players, cardsToWin, onNextTurn, categories }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
      {/* Carta */}
      <MiniCard
        card={result.card}
        category={categories.find(c => c.id === result.card.category_id)}
        label="La pregunta fue"
      />

      {/* Resultado */}
      <RoundHeadline card={result.card} winnerNames={result.winners} isTie={result.isTie} />

      {/* Votos */}
      {cardType(result.card) !== 'quien' ? (
        <ChoiceBreakdown card={result.card} votes={result.votes} nameOf={name => name} />
      ) : (
        <div className="card-surface p-4 flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888]">Votos</h3>
          {Object.entries(result.tally)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex-1 font-semibold">{name}</span>
                <div className="flex gap-1">
                  {Array.from({ length: count }).map((_, i) => (
                    <span key={i} className="text-[#c8ff00]">●</span>
                  ))}
                </div>
                <span className="text-[#888] text-sm w-4 text-right">{count}</span>
              </div>
            ))}
        </div>
      )}

      {/* Scoreboard */}
      <Scoreboard players={players} cardsToWin={cardsToWin} highlightNames={result.winners} />

      {/* Acciones */}
      <div className="flex flex-col gap-3 pb-6">
        <button onClick={onNextTurn} className="btn-primary text-lg py-4">Siguiente turno →</button>
        <button
          onClick={() => setShowModal(true)}
          className="btn-secondary text-sm"
        >
          + Crear pregunta
        </button>
      </div>

      {showModal && (
        <CreateCardModal
          categories={categories}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
