import { LocalGameState, LocalPlayer, OnlineGameState, OnlinePlayer, Card, TieAction } from '@/types/game'

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

function countVotes(votes: Record<string, string>): Record<string, number> {
  const tally: Record<string, number> = {}
  for (const votedFor of Object.values(votes)) {
    tally[votedFor] = (tally[votedFor] || 0) + 1
  }
  return tally
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
  const card = pickCard(state.cards, state.usedCardIds)
  return { ...state, currentCard: card, phase: 'card_reveal', votes: {}, roundResult: null }
}

export function localStartVoting(state: LocalGameState): LocalGameState {
  return { ...state, phase: 'voting' }
}

export function localCastVote(state: LocalGameState, voterName: string, votedForName: string): LocalGameState {
  return { ...state, votes: { ...state.votes, [voterName]: votedForName } }
}

export function localResolveRound(state: LocalGameState): LocalGameState {
  const tally = countVotes(state.votes)
  const maxVotes = Math.max(0, ...Object.values(tally))
  const winners = Object.keys(tally).filter(name => tally[name] === maxVotes)
  const isTie = winners.length > 1
  const winnerName = isTie ? null : winners[0]
  const winner = winnerName ? state.players.find(p => p.name === winnerName) ?? null : null

  let updatedPlayers = state.players
  let usedCardIds = state.usedCardIds

  if (winner && state.currentCard) {
    updatedPlayers = state.players.map(p => p.name === winner.name ? { ...p, cardsWon: p.cardsWon + 1 } : p)
  }
  if (state.currentCard && (!isTie || state.tieAction === 'discard')) {
    usedCardIds = [...state.usedCardIds, state.currentCard.id]
  }

  return {
    ...state,
    players: updatedPlayers,
    usedCardIds,
    phase: 'round_result',
    roundResult: {
      card: state.currentCard!,
      votes: state.votes,
      tally,
      winner: winner ? updatedPlayers.find(p => p.name === winner.name) ?? null : null,
      isTie,
    },
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
  const card = pickCard(state.cards, state.usedCardIds)
  return { ...state, currentCard: card, phase: 'card_reveal', votes: {}, roundResult: null }
}

export function onlineStartVoting(state: OnlineGameState): OnlineGameState {
  return { ...state, phase: 'voting' }
}

export function onlineCastVote(state: OnlineGameState, voterId: string, votedForId: string): OnlineGameState {
  return { ...state, votes: { ...state.votes, [voterId]: votedForId } }
}

export function onlineResolveRound(state: OnlineGameState): OnlineGameState {
  const tally = countVotes(state.votes)
  const maxVotes = Math.max(0, ...Object.values(tally))
  const winners = Object.keys(tally).filter(id => tally[id] === maxVotes)
  const isTie = winners.length > 1
  const winnerId = isTie ? null : winners[0] ?? null

  let updatedPlayers = state.players
  let usedCardIds = state.usedCardIds

  if (winnerId) {
    updatedPlayers = state.players.map(p => p.id === winnerId ? { ...p, cards_won: p.cards_won + 1 } : p)
  }
  if (state.currentCard && (!isTie || state.tieAction === 'discard')) {
    usedCardIds = [...state.usedCardIds, state.currentCard.id]
  }

  return {
    ...state,
    players: updatedPlayers,
    usedCardIds,
    phase: 'round_result',
    roundResult: { card: state.currentCard!, tally, winnerId, isTie },
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
