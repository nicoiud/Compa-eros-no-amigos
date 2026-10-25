'use client'
import { LocalPlayer, Card, Category } from '@/types/game'
import GameCard from '@/components/GameCard'

interface Props {
  card: Card | null
  category?: Category
  currentPlayer: LocalPlayer | null
  round: number
  onStartVoting: () => void
  onRevealCard: () => void
}

export default function CardReveal({ card, category, currentPlayer, round, onStartVoting, onRevealCard }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-[#888] text-sm uppercase tracking-widest mb-1">Ronda {round} · Le toca a</p>
        <p className="text-2xl font-black text-[#c8ff00]">{currentPlayer?.name}</p>
      </div>

      <GameCard card={card} category={category} onDraw={onRevealCard} />

      <div className="w-full max-w-[300px] h-14">
        {card ? (
          <button onClick={onStartVoting} className="btn-primary text-lg w-full">
            ¡Listo, a votar!
          </button>
        ) : (
          <button onClick={onRevealCard} className="btn-secondary text-lg w-full">
            Sacar carta
          </button>
        )}
      </div>
    </div>
  )
}
