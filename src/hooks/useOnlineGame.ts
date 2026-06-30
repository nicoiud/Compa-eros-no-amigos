'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OnlineGameState, OnlinePlayer, Card, Category, TieAction } from '@/types/game'
import {
  onlineStartGame,
  onlineRevealCard,
  onlineStartVoting,
  onlineCastVote,
  onlineResolveRound,
  onlineNextTurn,
} from '@/lib/game/engine'

interface UseOnlineGameProps {
  roomId: string
  roomCode: string
  playerId: string
  isHost: boolean
}

export function useOnlineGame({ roomId, playerId, isHost }: UseOnlineGameProps) {
  const [game, setGame] = useState<OnlineGameState | null>(null)
  const [lobbyPlayers, setLobbyPlayers] = useState<OnlinePlayer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allCards, setAllCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  // Carga inicial de cartas y categorías
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

  // Suscripción Realtime
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`room:${roomId}`)
      // Jugadores en lobby
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` }, payload => {
        if (payload.eventType === 'INSERT') {
          setLobbyPlayers(prev => [...prev, payload.new as OnlinePlayer])
        } else if (payload.eventType === 'DELETE') {
          setLobbyPlayers(prev => prev.filter(p => p.player_id !== (payload.old as OnlinePlayer).player_id))
        }
      })
      // Estado del juego
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` }, payload => {
        setGame(payload.new.state as OnlineGameState)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` }, payload => {
        setGame(payload.new.state as OnlineGameState)
      })
      .subscribe()

    // Cargar jugadores existentes en lobby
    supabase.from('players').select('*').eq('room_id', roomId).then(({ data }) => {
      setLobbyPlayers((data ?? []) as unknown as OnlinePlayer[])
    })

    // Cargar game_state si ya existe
    supabase.from('game_state').select('state').eq('room_id', roomId).maybeSingle().then(({ data }) => {
      if (data) setGame(data.state as OnlineGameState)
    })

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  // Solo el host puede mutar el estado
  async function pushState(newState: OnlineGameState) {
    const supabase = createClient()
    await supabase.from('game_state').upsert({ room_id: roomId, state: newState })
    setGame(newState)
  }

  async function hostStartGame(enabledCategoryIds: string[], cardsToWin: number, tieAction: TieAction) {
    if (!isHost) return
    const newState = onlineStartGame(lobbyPlayers, allCards, enabledCategoryIds, cardsToWin, tieAction)
    await pushState(newState)
    // Actualizar status de la sala
    const supabase = createClient()
    await supabase.from('rooms').update({ status: 'in_progress' }).eq('id', roomId)
  }

  async function hostRevealCard() {
    if (!isHost || !game) return
    await pushState(onlineRevealCard(game))
  }

  async function hostStartVoting() {
    if (!isHost || !game) return
    await pushState(onlineStartVoting(game))
  }

  async function castVote(votedForId: string) {
    if (!game) return
    const newState = onlineCastVote(game, playerId, votedForId)
    await pushState(newState)
  }

  async function hostResolveRound() {
    if (!isHost || !game) return
    await pushState(onlineResolveRound(game))
  }

  async function hostNextTurn() {
    if (!isHost || !game) return
    const newState = onlineNextTurn(game)
    await pushState(newState)
    if (newState.phase === 'finished') {
      const supabase = createClient()
      await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomId)
    }
  }

  const mePlayer = game?.players.find(p => p.player_id === playerId) ?? null
  const currentTurnPlayer = game ? game.players[game.currentTurnIndex] : null
  const isMyTurn = currentTurnPlayer?.player_id === playerId
  const alreadyVoted = game ? game.votes[playerId] !== undefined : false
  const allVotesCast = game
    ? game.players.every(p => p.player_id === currentTurnPlayer?.player_id || game.votes[p.player_id] !== undefined)
    : false

  return {
    game,
    lobbyPlayers,
    categories,
    loading,
    mePlayer,
    currentTurnPlayer,
    isMyTurn,
    alreadyVoted,
    allVotesCast,
    hostStartGame,
    hostRevealCard,
    hostStartVoting,
    castVote,
    hostResolveRound,
    hostNextTurn,
  }
}
