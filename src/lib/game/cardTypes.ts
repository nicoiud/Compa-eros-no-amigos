import { Card, CardType } from '@/types/game'

export function cardType(card: Card | null | undefined): CardType {
  return card?.type ?? 'quien'
}

// En "¿Quién...?" no vota el que tiene el turno; en el resto contestan todos
export function turnPlayerVotes(card: Card | null | undefined) {
  return cardType(card) !== 'quien'
}

export const PREFERIS_DEFAULT_TEXT = '¿Qué preferís?'

export interface Choice {
  value: string
  label: string
}

// Opciones para "¿Qué preferís?" y "Yo nunca" (en "¿Quién...?" se vota a un jugador)
export function choicesFor(card: Card): Choice[] {
  if (cardType(card) === 'preferis') {
    return [
      { value: 'a', label: card.option_a ?? 'A' },
      { value: 'b', label: card.option_b ?? 'B' },
    ]
  }
  return [
    { value: 'si', label: '🙋 Yo sí' },
    { value: 'no', label: '😇 Yo nunca' },
  ]
}

export const TYPE_LABELS: Record<CardType, string> = {
  quien: '¿Quién...?',
  preferis: '¿Qué preferís?',
  yo_nunca: 'Yo nunca',
}

// Tipo sugerido al elegir categoría en los formularios de crear carta
export function typeForCategory(slug?: string): CardType {
  if (slug?.startsWith('que-preferis')) return 'preferis'
  if (slug?.startsWith('yo-nunca')) return 'yo_nunca'
  return 'quien'
}
