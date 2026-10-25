'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OnlineGameState, OnlinePlayer, Card, Category, TieAction } from '@/types/game'
import {
  onlineStartGame, onlineRevealCard, onlineStartVoting,
  onlineCastVote, onlineResolveRound, onlineNextTurn,
} from '@/lib/game/engine'

interface UseOnlineGameProps {
  roomId: string
  roomCode: string
  playerId: string
  isHost: boolean
}

export function useOnlineGame({ roomId, playerId }: UseOnlineGameProps) {
  const [game, setGame] = useState<OnlineGameState | null>(null)
  const [lobbyPlayers, setLobbyPlayers] = useState<OnlinePlayer[]>([])
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

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` }, () => {
        supabase.from('players').select('*').eq('room_id', roomId).then(({ data }) => {
          setLobbyPlayers((data ?? []) as unknown as OnlinePlayer[])
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` }, payload => {
        setGame(payload.new.state as OnlineGameState)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` }, payload => {
        setGame(payload.new.state as OnlineGameState)
      })
      .subscribe()

    supabase.from('players').select('*').eq('room_id', roomId).then(({ data }) => {
      setLobbyPlayers((data ?? []) as unknown as OnlinePlayer[])
    })
    supabase.from('game_state').select('state').eq('room_id', roomId).maybeSingle().then(({ data }) => {
      if (data) setGame(data.state as OnlineGameState)
    })

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  async function pushState(newState: OnlineGameState) {
    const supabase = createClient()
    await supabase.from('game_state').upsert({ room_id: roomId, state: newState })
    setGame(newState)
  }

  async function hostStartGame(enabledCategoryIds: string[], cardsToWin: number, tieAction: TieAction) {
    const newState = onlineStartGame(lobbyPlayers, allCards, enabledCategoryIds, cardsToWin, tieAction)
    await pushState(newState)
    const supabase = createClient()
    await supabase.from('rooms').update({ status: 'in_progress' }).eq('id', roomId)
  }

  async function hostRevealCard() {
    if (!game) return
    await pushState(onlineRevealCard(game))
  }

  async function hostStartVoting() {
    if (!game) return
    await pushState(onlineStartVoting(game))
  }

  async function castVote(votedForId: string) {
    if (!game) return
    // Se vota vía RPC (merge atómico en la DB): si cada jugador subiera el estado
    // entero, dos votos simultáneos se pisarían y la ronda quedaría trabada.
    const supabase = createClient()
    const { error } = await supabase.rpc('cast_vote', {
      p_room_id: roomId,
      p_voter_id: playerId,
      p_voted_for_id: votedForId,
    })
    if (error) {
      // Sin la migración 0002 la función no existe: votamos como antes
      console.warn('cast_vote RPC falló, se usa upsert del estado:', error.message)
      await pushState(onlineCastVote(game, playerId, votedForId))
      return
    }
    setGame(g => (g ? onlineCastVote(g, playerId, votedForId) : g))
  }

  async function hostResolveRound() {
    if (!game) return
    await pushState(onlineResolveRound(game))
  }

  async function hostNextTurn() {
    if (!game) return
    const newState = onlineNextTurn(game)
    await pushState(newState)
    if (newState.phase === 'finished') {
      const supabase = createClient()
      await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomId)
    }
  }

  const mePlayer = game?.players.find(p => p.id === playerId) ?? lobbyPlayers.find(p => p.id === playerId) ?? null
  const currentTurnPlayer = game ? game.players[game.currentTurnIndex] : null
  const isMyTurn = currentTurnPlayer?.id === playerId
  const alreadyVoted = game ? game.votes[playerId] !== undefined : false
  const allVotesCast = game
    ? game.players.every(p => p.id === currentTurnPlayer?.id || game.votes[p.id] !== undefined)
    : false

  return {
    game, lobbyPlayers, categories, loading,
    mePlayer, currentTurnPlayer, isMyTurn, alreadyVoted, allVotesCast,
    hostStartGame, hostRevealCard, hostStartVoting, castVote, hostResolveRound, hostNextTurn,
  }
}
