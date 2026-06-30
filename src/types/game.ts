export type GameMode = 'local' | 'online' | 'presencial'
export type RoomStatus = 'lobby' | 'in_progress' | 'finished'
export type CardVisibility = 'official' | 'private' | 'public'
export type ModerationStatus = 'approved' | 'pending' | 'rejected'
export type TieAction = 'discard' | 'replay'
export type GamePhase = 'setup' | 'lobby' | 'card_reveal' | 'voting' | 'round_result' | 'finished'

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
  active: boolean
  visibility: CardVisibility
  moderation_status: ModerationStatus
  created_at: string
}

// ─── LOCAL MODE (1 dispositivo) ────────────────────────────────────────────

export interface LocalPlayer {
  name: string
  cardsWon: number
  turnOrder: number
}

export interface RoundResult {
  card: Card
  votes: Record<string, string> // voterName → votedForName
  tally: Record<string, number> // playerName → voteCount
  winner: LocalPlayer | null
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
  votes: Record<string, string> // voterName → votedForName
  roundResult: RoundResult | null
}

// ─── ONLINE MODE ────────────────────────────────────────────────────────────

export interface OnlinePlayer {
  player_id: string // UUID del dispositivo
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
  cards: Card[] // mazo mezclado
  usedCardIds: string[]
  currentCard: Card | null
  currentTurnIndex: number
  round: number
  cardsToWin: number
  tieAction: TieAction
  votes: Record<string, string> // player_id → player_id
  roundResult: OnlineRoundResult | null
}

export interface OnlineRoundResult {
  card: Card
  tally: Record<string, number> // player_id → voteCount
  winnerId: string | null
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
