export type GameMode = 'local' | 'online' | 'presencial'
export type RoomStatus = 'lobby' | 'in_progress' | 'finished'
export type CardVisibility = 'official' | 'private' | 'public'
export type ModerationStatus = 'approved' | 'pending' | 'rejected'
export type TieAction = 'discard' | 'replay'
export type GamePhase = 'setup' | 'lobby' | 'card_reveal' | 'voting' | 'round_result' | 'finished'
// quien: se vota a un jugador · preferis: cada uno elige A o B · yo_nunca: cada uno dice "yo sí" o "yo nunca"
export type CardType = 'quien' | 'preferis' | 'yo_nunca'

export interface Category {
  id: string
  name: string
  slug: string
  is_adult: boolean
  active: boolean
  sort_order: number
}

export interface Card {
  id: string
  category_id: string
  text: string
  // Opcionales: las bases sin la migración 0005 no tienen estas columnas
  type?: CardType
  option_a?: string | null
  option_b?: string | null
  active: boolean
  visibility: CardVisibility
  moderation_status: ModerationStatus
  created_at: string
}

// ─── LOCAL MODE ──────────────────────────────────────────────

export interface LocalPlayer {
  name: string
  cardsWon: number
  turnOrder: number
}

export interface RoundResult {
  card: Card
  votes: Record<string, string>
  tally: Record<string, number>
  winners: string[]   // nombres de quienes se llevan la carta
  isTie: boolean
}

export interface LocalGameState {
  phase: GamePhase
  players: LocalPlayer[]
  enabledCategoryIds: string[]
  cards: Card[]
  usedCardIds: string[]
  currentCard: Card | null
  currentTurnIndex: number
  round: number
  cardsToWin: number
  tieAction: TieAction
  votes: Record<string, string>
  roundResult: RoundResult | null
}

// ─── ONLINE MODE ─────────────────────────────────────────────

export interface OnlinePlayer {
  id: string        // maps to players.id in DB
  name: string
  is_host: boolean
  cards_won: number
  turn_order: number
  connected: boolean
}

export interface OnlineGameState {
  phase: GamePhase
  players: OnlinePlayer[]
  enabledCategoryIds: string[]
  cards: Card[]
  usedCardIds: string[]
  currentCard: Card | null
  currentTurnIndex: number
  round: number
  cardsToWin: number
  tieAction: TieAction
  votes: Record<string, string>   // player id → player id
  roundResult: OnlineRoundResult | null
}

export interface OnlineRoundResult {
  card: Card
  tally: Record<string, number>   // player id (o opción elegida) → voteCount
  winnerIds: string[]
  isTie: boolean
}

export interface Room {
  id: string
  code: string
  mode: GameMode
  status: RoomStatus
  cards_to_win: number
  tie_action: TieAction
  created_at: string
}
