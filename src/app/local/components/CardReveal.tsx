'use client'
import { LocalPlayer, Card } from '@/types/game'

interface Props {
  card: Card | null
  currentPlayer: LocalPlayer | null
  round: number
  onStartVoting: () => void
  onRevealCard: () => void
}

export default function CardReveal({ card, currentPlayer, round, onStartVoting, onRevealCard }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-lg mx-auto">
      <div className="text-center text-[#888] text-sm uppercase tracking-widest">Ronda {round}</div>
      <div className="text-center">
        <p className="text-[#888] text-sm mb-1">Le toca a</p>
        <p className="text-2xl font-black text-[#c8ff00]">{currentPlayer?.name}</p>
      </div>

      {!card ? (
        <div className="card-surface p-8 w-full text-center">
          <p className="text-[#555] mb-6">Presioná para revelar la carta</p>
          <button onClick={onRevealCard} className="btn-primary text-lg px-10">Sacar carta</button>
        </div>
      ) : (
        <div className="card-surface p-8 w-full flex flex-col items-center gap-6">
          <p className="text-2xl font-bold text-center leading-snug">{card.text}</p>
          <button onClick={onStartVoting} className="btn-primary text-lg w-full">
            ¡Listo, a votar!
          </button>
        </div>
      )}
    </div>
  )
}
