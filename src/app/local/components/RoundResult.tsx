'use client'
import { useState } from 'react'
import { RoundResult as RoundResultType, LocalPlayer } from '@/types/game'
import { Category } from '@/types/game'
import CreateCardModal from './CreateCardModal'
import Scoreboard from './Scoreboard'
import { MiniCard } from '@/components/GameCard'

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
      <div className="card-surface p-6 text-center">
        {result.isTie ? (
          <>
            <div className="text-4xl mb-2">🤝</div>
            <h2 className="text-2xl font-black">¡Empate!</h2>
            <p className="text-[#888] mt-1">La carta no se asigna</p>
          </>
        ) : result.winner ? (
          <>
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-[#888] text-sm mb-1">Ganó la carta</p>
            <h2 className="text-3xl font-black text-[#c8ff00]">{result.winner.name}</h2>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">🃏</div>
            <h2 className="text-2xl font-black">Sin votos</h2>
          </>
        )}
      </div>

      {/* Votos */}
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

      {/* Scoreboard */}
      <Scoreboard players={players} cardsToWin={cardsToWin} highlightName={result.winner?.name} />

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
