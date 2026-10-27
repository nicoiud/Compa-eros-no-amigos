'use client'
import { LocalPlayer } from '@/types/game'

interface Props {
  players: LocalPlayer[]
  cardsToWin: number
  highlightNames?: string[]
}

export default function Scoreboard({ players, cardsToWin, highlightNames = [] }: Props) {
  const sorted = [...players].sort((a, b) => b.cardsWon - a.cardsWon)
  return (
    <div className="card-surface p-4 flex flex-col gap-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-1">Puntaje</h3>
      {sorted.map(p => (
        <div key={p.name} className={`flex items-center justify-between px-3 py-2 rounded-xl ${highlightNames.includes(p.name) ? 'bg-[#c8ff00]/10 border border-[#c8ff00]/30' : 'bg-[#242424]'}`}>
          <span className="font-semibold">{p.name}</span>
          <div className="flex gap-1">
            {Array.from({ length: cardsToWin }).map((_, i) => (
              <span key={i} className={`text-sm ${i < p.cardsWon ? 'text-[#c8ff00]' : 'text-white/10'}`}>■</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
