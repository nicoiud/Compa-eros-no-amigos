'use client'
import { CSSProperties } from 'react'
import { Card, Category } from '@/types/game'
import { categoryStyle } from '@/lib/game/categoryStyles'
import { cardType, PREFERIS_DEFAULT_TEXT } from '@/lib/game/cardTypes'

interface Props {
  card: Card | null
  category?: Category
  // Sin carta se muestra el dorso; al llegar la carta se da vuelta con animación
  onDraw?: () => void
  drawLabel?: string
}

function textSize(length: number) {
  if (length > 140) return 'text-lg'
  if (length > 90) return 'text-xl'
  return 'text-2xl'
}

// Texto de la carta según su tipo. En "¿Qué preferís?" el texto es la consigna
// (solo se muestra si no es la de siempre) y abajo van las dos opciones.
function CardContent({ card, big }: { card: Card; big?: boolean }) {
  if (cardType(card) === 'preferis') {
    const options = [card.option_a ?? '', card.option_b ?? '']
    const size = big ? textSize(options.join('').length + 50) : ''
    return (
      <div className="flex flex-col gap-2">
        {card.text !== PREFERIS_DEFAULT_TEXT && (
          <p className={`${big ? 'text-sm' : 'text-xs'} font-bold uppercase tracking-wider text-black/45`}>{card.text}</p>
        )}
        {options.map((option, i) => (
          <div key={i} className="flex flex-col gap-2">
            {i === 1 && <span className="text-xs font-black uppercase tracking-widest text-black/35">o</span>}
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[color:var(--cat)] text-black text-xs font-black flex items-center justify-center">
                {i === 0 ? 'A' : 'B'}
              </span>
              <p className={`${size} font-black leading-snug text-[#111]`}>{option}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <p className={`${big ? `${textSize(card.text.length)} font-black` : 'font-bold'} leading-snug text-[#111]`}>
      {card.text}
    </p>
  )
}

export default function GameCard({ card, category, onDraw, drawLabel = 'Tocá para sacar carta' }: Props) {
  const style = categoryStyle(category?.slug)
  const canDraw = !card && !!onDraw

  return (
    <div className="flip-card w-full max-w-[300px] aspect-[5/7] mx-auto">
      <div className={`flip-card-inner ${card ? 'is-flipped' : ''}`}>
        {/* Dorso */}
        <button
          type="button"
          onClick={onDraw}
          disabled={!canDraw}
          aria-label="Sacar carta"
          className="flip-card-face card-dorso flex flex-col items-center justify-center gap-4 p-6 disabled:cursor-default"
        >
          <span className="text-7xl font-black text-[#c8ff00] leading-none">¿?</span>
          <span className="text-xl font-black tracking-tight">
            Compa<span className="text-[#c8ff00]">ñeros</span>
          </span>
          <span className={`text-sm ${canDraw ? 'text-white/70 animate-pulse' : 'text-white/40'}`}>
            {drawLabel}
          </span>
        </button>

        {/* Frente */}
        <div
          className="flip-card-face card-frente flex flex-col p-5"
          style={{ '--cat': style.color } as CSSProperties}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[color:var(--cat)] text-black">
              {style.emoji} {category?.name ?? 'Carta'}
            </span>
          </div>
          <div className="flex-1 flex items-center">
            {card && <CardContent card={card} big />}
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-black/40">
            <span>Compañeros</span>
            <span className="text-lg">{style.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Versión chica para mostrar la pregunta mientras se vota o en el resultado
export function MiniCard({ card, category, label }: { card: Card; category?: Category; label?: string }) {
  const style = categoryStyle(category?.slug)
  return (
    <div
      className="mini-card rounded-2xl p-4 pl-6 flex flex-col gap-2"
      style={{ '--cat': style.color } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--cat)] text-black">
          {style.emoji} {category?.name ?? 'Carta'}
        </span>
        {label && <span className="text-[11px] uppercase tracking-widest text-black/40 font-bold">{label}</span>}
      </div>
      <CardContent card={card} />
    </div>
  )
}
