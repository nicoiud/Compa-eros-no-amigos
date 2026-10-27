'use client'
import { CardType } from '@/types/game'
import { PREFERIS_DEFAULT_TEXT, TYPE_LABELS } from '@/lib/game/cardTypes'

// Campos para escribir una carta, compartidos por el modal de crear y el admin
export interface CardDraft {
  type: CardType
  text: string
  option_a: string
  option_b: string
}

export const EMPTY_DRAFT: CardDraft = { type: 'quien', text: '', option_a: '', option_b: '' }

const PLACEHOLDERS: Record<CardType, string> = {
  quien: '¿Quién sería el primero en...?',
  preferis: PREFERIS_DEFAULT_TEXT,
  yo_nunca: 'Yo nunca...',
}

export function draftError(draft: CardDraft): string | null {
  if (draft.type === 'preferis') {
    return draft.option_a.trim() && draft.option_b.trim() ? null : 'Completá las dos opciones'
  }
  return draft.text.trim() ? null : 'Completá el texto'
}

// Columnas de la tabla cards que salen del borrador
export function draftColumns(draft: CardDraft) {
  const isPreferis = draft.type === 'preferis'
  return {
    type: draft.type,
    text: draft.text.trim() || (isPreferis ? PREFERIS_DEFAULT_TEXT : ''),
    option_a: isPreferis ? draft.option_a.trim() : null,
    option_b: isPreferis ? draft.option_b.trim() : null,
  }
}

const inputClass = 'bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50'

export default function CardFields({ draft, onChange, autoFocus }: {
  draft: CardDraft
  onChange: (draft: CardDraft) => void
  autoFocus?: boolean
}) {
  const set = (patch: Partial<CardDraft>) => onChange({ ...draft, ...patch })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(Object.keys(TYPE_LABELS) as CardType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => set({ type })}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${draft.type === type ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'border-white/20 text-white'}`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {draft.type === 'preferis' ? (
        <>
          <input
            className={inputClass}
            placeholder={`Consigna (opcional): ${PREFERIS_DEFAULT_TEXT}`}
            maxLength={80}
            value={draft.text}
            onChange={e => set({ text: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Opción A"
            maxLength={100}
            value={draft.option_a}
            onChange={e => set({ option_a: e.target.value })}
            autoFocus={autoFocus}
          />
          <input
            className={inputClass}
            placeholder="Opción B"
            maxLength={100}
            value={draft.option_b}
            onChange={e => set({ option_b: e.target.value })}
          />
        </>
      ) : (
        <textarea
          className={`${inputClass} resize-none text-base`}
          placeholder={PLACEHOLDERS[draft.type]}
          rows={3}
          maxLength={200}
          value={draft.text}
          onChange={e => set({ text: e.target.value })}
          autoFocus={autoFocus}
        />
      )}

      <div className="flex justify-between gap-3">
        <p className="text-xs text-[#555]">Tip: escribí {'{jugador}'} y el juego pone el nombre de alguien de la ronda.</p>
        {draft.type !== 'preferis' && <span className="text-xs text-[#555] shrink-0">{draft.text.length}/200</span>}
      </div>
    </div>
  )
}
