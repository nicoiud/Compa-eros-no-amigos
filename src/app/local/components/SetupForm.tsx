'use client'
import { useState } from 'react'
import { Category, TieAction } from '@/types/game'

interface Props {
  categories: Category[]
  onStart: (playerNames: string[], categoryIds: string[], cardsToWin: number, tieAction: TieAction) => void
}

export default function SetupForm({ categories, onStart }: Props) {
  const [names, setNames] = useState<string[]>(['', '', ''])
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [cardsToWin, setCardsToWin] = useState(5)
  const [tieAction, setTieAction] = useState<TieAction>('discard')

  const validNames = names.map(n => n.trim()).filter(Boolean)
  const uniqueNames = new Set(validNames)
  const hasDuplicates = uniqueNames.size !== validNames.length
  const canStart = validNames.length >= 3 && categoryIds.length > 0 && !hasDuplicates

  function addPlayer() { setNames(n => [...n, '']) }
  function removePlayer(i: number) { setNames(n => n.filter((_, idx) => idx !== i)) }
  function setName(i: number, v: string) { setNames(n => n.map((name, idx) => idx === i ? v : name)) }

  function toggleCategory(id: string) {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  function handleStart() {
    if (!canStart) return
    onStart(Array.from(uniqueNames), categoryIds, cardsToWin, tieAction)
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black mb-1">Compa<span className="text-[#c8ff00]">ñeros</span></h1>
        <p className="text-[#888]">Modo Local</p>
      </div>

      {/* Jugadores */}
      <section className="card-surface p-5 flex flex-col gap-3">
        <h2 className="font-bold text-lg">Jugadores <span className="text-[#888] text-sm">(mín. 3)</span></h2>
        {names.map((name, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 bg-[#242424] rounded-xl px-4 py-3 text-white placeholder:text-[#555] outline-none focus:ring-2 focus:ring-[#c8ff00]/50"
              placeholder={`Jugador ${i + 1}`}
              value={name}
              onChange={e => setName(i, e.target.value)}
              maxLength={24}
            />
            {names.length > 3 && (
              <button onClick={() => removePlayer(i)} className="text-[#888] hover:text-red-400 px-2">✕</button>
            )}
          </div>
        ))}
        {hasDuplicates && <p className="text-red-400 text-sm">Hay nombres duplicados</p>}
        {names.length < 10 && (
          <button onClick={addPlayer} className="text-[#c8ff00] text-sm font-semibold text-left">+ Agregar jugador</button>
        )}
      </section>

      {/* Categorías */}
      <section className="card-surface p-5 flex flex-col gap-3">
        <h2 className="font-bold text-lg">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                categoryIds.includes(cat.id)
                  ? 'bg-[#c8ff00] text-black border-[#c8ff00]'
                  : 'bg-transparent text-white border-white/20 hover:border-white/50'
              }`}
            >
              {cat.is_adult ? '🔞 ' : ''}{cat.name}
            </button>
          ))}
        </div>
        {categoryIds.length === 0 && <p className="text-[#888] text-sm">Elegí al menos una categoría</p>}
      </section>

      {/* Config */}
      <section className="card-surface p-5 flex flex-col gap-4">
        <h2 className="font-bold text-lg">Configuración</h2>
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#888]">Cartas para ganar</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setCardsToWin(v => Math.max(1, v - 1))} className="btn-secondary w-9 h-9 p-0 text-center">−</button>
            <span className="w-6 text-center font-bold">{cardsToWin}</span>
            <button onClick={() => setCardsToWin(v => Math.min(20, v + 1))} className="btn-secondary w-9 h-9 p-0 text-center">+</button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#888]">En caso de empate</label>
          <div className="flex gap-2">
            {(['discard', 'replay'] as TieAction[]).map(action => (
              <button
                key={action}
                onClick={() => setTieAction(action)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  tieAction === action
                    ? 'bg-[#c8ff00] text-black border-[#c8ff00]'
                    : 'bg-transparent text-white border-white/20'
                }`}
              >
                {action === 'discard' ? 'Descartar carta' : 'Repetir ronda'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button onClick={handleStart} disabled={!canStart} className="btn-primary text-lg py-4">
        Iniciar partida
      </button>
    </div>
  )
}
