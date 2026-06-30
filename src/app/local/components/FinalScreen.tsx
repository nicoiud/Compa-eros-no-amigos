'use client'
import { useState } from 'react'
import { LocalPlayer } from '@/types/game'
import { Category } from '@/types/game'
import CreateCardModal from './CreateCardModal'

interface Props {
  players: LocalPlayer[]
  cardsToWin: number
  onPlayAgain: () => void
  categories: Category[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function FinalScreen({ players, cardsToWin, onPlayAgain, categories }: Props) {
  const [showModal, setShowModal] = useState(false)
  const sorted = [...players].sort((a, b) => b.cardsWon - a.cardsWon)
  const winner = sorted[0]

  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-6 max-w-lg mx-auto">
      <div className="text-center pt-8">
        <div className="text-6xl mb-3">🏆</div>
        <p className="text-[#888] text-sm uppercase tracking-widest mb-1">Ganó la partida</p>
        <h1 className="text-4xl font-black text-[#c8ff00]">{winner?.name}</h1>
        <p className="text-[#888] mt-1">{winner?.cardsWon} carta{winner?.cardsWon !== 1 ? 's' : ''}</p>
      </div>

      <div className="card-surface w-full p-5 flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#888]">Ranking final</h2>
        {sorted.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3 py-1">
            <span className="text-xl w-8">{MEDALS[i] ?? `${i + 1}.`}</span>
            <span className="flex-1 font-semibold">{p.name}</span>
            <div className="flex gap-1">
              {Array.from({ length: cardsToWin }).map((_, j) => (
                <span key={j} className={`text-sm ${j < p.cardsWon ? 'text-[#c8ff00]' : 'text-white/10'}`}>■</span>
              ))}
            </div>
            <span className="text-[#888] text-sm w-6 text-right">{p.cardsWon}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full pb-8">
        <button onClick={onPlayAgain} className="btn-primary text-lg py-4">Jugar de nuevo</button>
        <button onClick={() => setShowModal(true)} className="btn-secondary">+ Crear pregunta</button>
        <a href="/" className="text-center text-[#888] text-sm hover:text-white mt-2">Volver al inicio</a>
      </div>

      {showModal && (
        <CreateCardModal categories={categories} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
