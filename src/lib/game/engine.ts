import { LocalGameState, LocalPlayer, OnlineGameState, OnlinePlayer, Card, TieAction } from '@/types/game'
import { cardType } from './cardTypes'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickCard(cards: Card[], usedCardIds: string[]): Card | null {
  const available = cards.filter(c => !usedCardIds.includes(c.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

// Las cartas pueden nombrar a alguien de la ronda con {jugador}: se elige al sacar la
// carta y queda en currentCard, así en online todos ven el mismo nombre.
function personalize(card: Card | null, playerNames: string[]): Card | null {
  const fields = [card?.text, card?.option_a, card?.option_b]
  if (!card || !fields.some(f => f?.includes('{jugador}')) || playerNames.length === 0) return card
  const name = playerNames[Math.floor(Math.random() * playerNames.length)]
  const fill = (s: string) => s.split('{jugador}').join(name)
  return {
    ...card,
    text: fill(card.text),
    option_a: card.option_a && fill(card.option_a),
    option_b: card.option_b && fill(card.option_b),
  }
}

function countVotes(votes: Record<string, string>): Record<string, number> {
  const tally: Record<string, number> = {}
  for (const votedFor of Object.values(votes)) {
    tally[votedFor] = (tally[votedFor] || 0) + 1
  }
  return tally
}

// Quién se lleva la carta. En "¿Quién...?" el más votado; en "¿Qué preferís?" y
// "Yo nunca" se la lleva la minoría (si todos eligen lo mismo, nadie).
function resolveVotes(card: Card, votes: Record<string, string>) {
  const tally = countVotes(votes)
  if (cardType(card) === 'quien') {
    const maxVotes = Math.max(0, ...Object.values(tally))
    const top = Object.keys(tally).filter(k => tally[k] === maxVotes)
    return { tally, winners: top.length === 1 ? top : [], isTie: top.length > 1 }
  }
  const [a, b] = Object.keys(tally)
  if (b === undefined) return { tally, winners: [], isTie: false }
  if (tally[a] === tally[b]) return { tally, winners: [], isTie: true }
  const minority = tally[a] < tally[b] ? a : b
  return { tally, winners: Object.keys(votes).filter(voter => votes[voter] === minority), isTie: false }
}

// ─── LOCAL ENGINE ─────────────────────────────────────────────

export function localStartGame(
  playerNames: string[],
  cards: Card[],
  enabledCategoryIds: string[],
  cardsToWin: number,
  tieAction: TieAction
): LocalGameState {
  const shuffledNames = shuffle(playerNames)
  const players: LocalPlayer[] = shuffledNames.map((name, i) => ({ name, cardsWon: 0, turnOrder: i }))
  const filteredCards = cards.filter(c => enabledCategoryIds.includes(c.category_id))
  return {
    phase: 'card_reveal',
    players,
    enabledCategoryIds,
    cards: filteredCards,
    usedCardIds: [],
    currentCard: null,
    currentTurnIndex: 0,
    round: 1,
    cardsToWin,
    tieAction,
    votes: {},
    roundResult: null,
  }
}

export function localRevealCard(state: LocalGameState): LocalGameState {
  const card = personalize(pickCard(state.cards, state.usedCardIds), state.players.map(p => p.name))
  return { ...state, currentCard: card, phase: 'card_reveal', votes: {}, roundResult: null }
}

export function localStartVoting(state: LocalGameState): LocalGameState {
  return { ...state, phase: 'voting' }
}

export function localCastVote(state: LocalGameState, voterName: string, votedForName: string): LocalGameState {
  return { ...state, votes: { ...state.votes, [voterName]: votedForName } }
}

export function localResolveRound(state: LocalGameState): LocalGameState {
  const card = state.currentCard!
  const { tally, winners, isTie } = resolveVotes(card, state.votes)
  const updatedPlayers = state.players.map(p => winners.includes(p.name) ? { ...p, cardsWon: p.cardsWon + 1 } : p)
  const usedCardIds = !isTie || state.tieAction === 'discard' ? [...state.usedCardIds, card.id] : state.usedCardIds

  return {
    ...state,
    players: updatedPlayers,
    usedCardIds,
    phase: 'round_result',
    roundResult: { card, votes: state.votes, tally, winners, isTie },
  }
}

export function localNextTurn(state: LocalGameState): LocalGameState {
  const winner = state.players.find(p => p.cardsWon >= state.cardsToWin)
  if (winner) return { ...state, phase: 'finished' }
  const nextTurnIndex = (state.currentTurnIndex + 1) % state.players.length
  const available = state.cards.filter(c => !state.usedCardIds.includes(c.id))
  return {
    ...state,
    currentTurnIndex: nextTurnIndex,
    round: state.round + 1,
    currentCard: null,
    votes: {},
    roundResult: null,
    usedCardIds: available.length === 0 ? [] : state.usedCardIds,
    phase: 'card_reveal',
  }
}

// ─── ONLINE ENGINE ────────────────────────────────────────────

export function onlineStartGame(
  players: OnlinePlayer[],
  cards: Card[],
  enabledCategoryIds: string[],
  cardsToWin: number,
  tieAction: TieAction
): OnlineGameState {
  const shuffledPlayers = shuffle(players).map((p, i) => ({ ...p, turn_order: i }))
  const filteredCards = cards.filter(c => enabledCategoryIds.includes(c.category_id))
  return {
    phase: 'card_reveal',
    players: shuffledPlayers,
    enabledCategoryIds,
    cards: filteredCards,
    usedCardIds: [],
    currentCard: null,
    currentTurnIndex: 0,
    round: 1,
    cardsToWin,
    tieAction,
    votes: {},
    roundResult: null,
  }
}

export function onlineRevealCard(state: OnlineGameState): OnlineGameState {
  const card = personalize(pickCard(state.cards, state.usedCardIds), state.players.map(p => p.name))
  return { ...state, currentCard: card, phase: 'card_reveal', votes: {}, roundResult: null }
}

export function onlineStartVoting(state: OnlineGameState): OnlineGameState {
  return { ...state, phase: 'voting' }
}

export function onlineCastVote(state: OnlineGameState, voterId: string, votedForId: string): OnlineGameState {
  return { ...state, votes: { ...state.votes, [voterId]: votedForId } }
}

export function onlineResolveRound(state: OnlineGameState): OnlineGameState {
  const card = state.currentCard!
  const { tally, winners, isTie } = resolveVotes(card, state.votes)
  const updatedPlayers = state.players.map(p => winners.includes(p.id) ? { ...p, cards_won: p.cards_won + 1 } : p)
  const usedCardIds = !isTie || state.tieAction === 'discard' ? [...state.usedCardIds, card.id] : state.usedCardIds

  return {
    ...state,
    players: updatedPlayers,
    usedCardIds,
    phase: 'round_result',
    roundResult: { card, tally, winnerIds: winners, isTie },
  }
}

export function onlineNextTurn(state: OnlineGameState): OnlineGameState {
  const winner = state.players.find(p => p.cards_won >= state.cardsToWin)
  if (winner) return { ...state, phase: 'finished' }
  const nextTurnIndex = (state.currentTurnIndex + 1) % state.players.length
  const available = state.cards.filter(c => !state.usedCardIds.includes(c.id))
  return {
    ...state,
    currentTurnIndex: nextTurnIndex,
    round: state.round + 1,
    currentCard: null,
    votes: {},
    roundResult: null,
    usedCardIds: available.length === 0 ? [] : state.usedCardIds,
    phase: 'card_reveal',
  }
}
