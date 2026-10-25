'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LocalGameState, Card, Category, TieAction } from '@/types/game'
import {
  localStartGame,
  localRevealCard,
  localStartVoting,
  localCastVote,
  localResolveRound,
  localNextTurn,
} from '@/lib/game/engine'

const INITIAL_STATE: LocalGameState = {
  phase: 'setup',
  players: [],
  enabledCategoryIds: [],
  cards: [],
  usedCardIds: [],
  currentCard: null,
  currentTurnIndex: 0,
  round: 1,
  cardsToWin: 5,
  tieAction: 'discard',
  votes: {},
  roundResult: null,
}

export function useLocalGame() {
  const [game, setGame] = useState<LocalGameState>(INITIAL_STATE)
  const [categories, setCategories] = useState<Category[]>([])
  const [allCards, setAllCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: cats }, { data: cards }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('cards').select('*').eq('active', true).eq('moderation_status', 'approved'),
      ])
      setCategories(cats ?? [])
      setAllCards(cards ?? [])
      setLoading(false)
    }
    load()
  }, [])

  function startGame(
    playerNames: string[],
    enabledCategoryIds: string[],
    cardsToWin: number,
    tieAction: TieAction
  ) {
    setGame(localStartGame(playerNames, allCards, enabledCategoryIds, cardsToWin, tieAction))
  }

  function revealCard() {
    setGame(s => localRevealCard(s))
  }

  function startVoting() {
    setGame(s => localStartVoting(s))
  }

  function castVote(voterName: string, votedForName: string) {
    setGame(s => localCastVote(s, voterName, votedForName))
  }

  function resolveRound() {
    setGame(s => localResolveRound(s))
  }

  function nextTurn() {
    setGame(s => localNextTurn(s))
  }

  function resetGame() {
    setGame(INITIAL_STATE)
  }

  const cardCounts: Record<string, number> = {}
  for (const c of allCards) cardCounts[c.category_id] = (cardCounts[c.category_id] ?? 0) + 1

  const currentPlayer = game.players[game.currentTurnIndex] ?? null
  const allVotesCast =
    game.players.length > 0 &&
    game.players.every(p => p.name === currentPlayer?.name || game.votes[p.name] !== undefined)

  return {
    game,
    categories,
    cardCounts,
    loading,
    currentPlayer,
    allVotesCast,
    startGame,
    revealCard,
    startVoting,
    castVote,
    resolveRound,
    nextTurn,
    resetGame,
  }
}
