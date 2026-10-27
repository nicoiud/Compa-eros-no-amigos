'use client'
import { Card } from '@/types/game'
import { cardType, choicesFor } from '@/lib/game/cardTypes'

// Cartel de quién se llevó la carta
export function RoundHeadline({ card, winnerNames, isTie }: { card: Card; winnerNames: string[]; isTie: boolean }) {
  const type = cardType(card)
  return (
    <div className="card-surface p-6 text-center">
      {isTie ? (
        <>
          <div className="text-4xl mb-2">🤝</div>
          <h2 className="text-2xl font-black">¡Empate!</h2>
          <p className="text-[#888] mt-1">La carta no se asigna</p>
        </>
      ) : winnerNames.length > 0 ? (
        <>
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-[#888] text-sm mb-1">
            {winnerNames.length > 1 ? 'Se llevan la carta' : type === 'quien' ? 'Ganó la carta' : 'Se lleva la carta'}
            {type !== 'quien' && ' por ser minoría'}
          </p>
          <h2 className="text-3xl font-black text-[#c8ff00]">{winnerNames.join(' y ')}</h2>
        </>
      ) : type === 'quien' ? (
        <>
          <div className="text-4xl mb-2">🃏</div>
          <h2 className="text-2xl font-black">Sin votos</h2>
        </>
      ) : (
        <>
          <div className="text-4xl mb-2">🫱🏻‍🫲🏽</div>
          <h2 className="text-2xl font-black">Todos eligieron lo mismo</h2>
          <p className="text-[#888] mt-1">Nadie se lleva la carta</p>
        </>
      )}
    </div>
  )
}

// Qué eligió cada uno en "¿Qué preferís?" y "Yo nunca"
export function ChoiceBreakdown({ card, votes, nameOf }: {
  card: Card
  votes: Record<string, string>
  nameOf: (voter: string) => string
}) {
  const isPreferis = cardType(card) === 'preferis'
  return (
    <div className="card-surface p-4 flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#888]">Respuestas</h3>
      {choicesFor(card).map((choice, i) => {
        const voters = Object.keys(votes).filter(v => votes[v] === choice.value)
        return (
          <div key={choice.value} className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              {isPreferis && <span className="font-black text-[#c8ff00]">{i === 0 ? 'A' : 'B'}</span>}
              <span className="flex-1 font-semibold leading-snug">{choice.label}</span>
              <span className="text-[#888] text-sm">{voters.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {voters.map(v => (
                <span key={v} className="text-xs bg-[#242424] px-2 py-1 rounded-lg">{nameOf(v)}</span>
              ))}
              {voters.length === 0 && <span className="text-xs text-[#555]">Nadie</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
