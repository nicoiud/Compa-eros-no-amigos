'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room, OnlinePlayer, Category, TieAction } from '@/types/game'

interface Props {
  room: Room
  playerId: string
}

export default function OnlineLobbyRoom({ room, playerId }: Props) {
  const [players, setPlayers] = useState<OnlinePlayer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enabledCatIds, setEnabledCatIds] = useState<string[]>([])
  const [cardsToWin, setCardsToWin] = useState(5)
  const [tieAction, setTieAction] = useState<TieAction>('discard')
  const [starting, setStarting] = useState(false)

  const me = players.find(p => p.id === playerId)
  const isHost = me?.is_host ?? false

  useEffect(() => {
    const supabase = createClient()

    function loadPlayers() {
      supabase.from('players').select('*').eq('room_id', room.id).then(({ data }) =>
        setPlayers((data ?? []) as unknown as OnlinePlayer[])
      )
    }

    loadPlayers()
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data ?? []))

    const channel = supabase.channel(`lobby:${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room.id}` }, loadPlayers)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` }, payload => {
        if (payload.new.status === 'in_progress') window.location.reload()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [room.id])

  function toggleCat(id: string) {
    setEnabledCatIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  async function startGame() {
    if (players.length < 3 || enabledCatIds.length === 0) return
    setStarting(true)
    const supabase = createClient()
    const { data: cards } = await supabase.from('cards').select('*').eq('active', true).eq('moderation_status', 'approved')

    const onlinePlayers: OnlinePlayer[] = players.map((p, i) => ({
      id: p.id,
      name: p.name,
      is_host: p.is_host,
      cards_won: 0,
      turn_order: i,
      connected: true,
    }))

    const { onlineStartGame } = await import('@/lib/game/engine')
    const state = onlineStartGame(onlinePlayers, cards ?? [], enabledCatIds, cardsToWin, tieAction)

    await supabase.from('game_state').insert({ room_id: room.id, state })
    await supabase.from('rooms').update({ status: 'in_progress' }).eq('id', room.id)
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto flex flex-col gap-6">
      <div className="text-center">
        <p className="text-[#888] text-sm">Código de sala</p>
        <p className="text-5xl font-black tracking-widest text-[#c8ff00]">{room.code}</p>
        <p className="text-[#888] text-sm mt-1">Compartilo con tus amigos</p>
      </div>

      <div className="card-surface p-4 flex flex-col gap-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#888]">Jugadores ({players.length})</h2>
        {players.map(p => (
          <div key={p.id} className="flex items-center gap-2 py-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
            <span className="font-semibold">{p.name}</span>
            {p.is_host && <span className="text-xs text-[#888] ml-auto">host</span>}
          </div>
        ))}
        {players.length < 3 && <p className="text-[#888] text-xs mt-1">Mínimo 3 jugadores para iniciar</p>}
      </div>

      {isHost && (
        <>
          <div className="card-surface p-4 flex flex-col gap-3">
            <h2 className="font-bold">Categorías</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${enabledCatIds.includes(cat.id) ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'border-white/20 text-white'}`}
                >
                  {cat.is_adult ? '🔞 ' : ''}{cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card-surface p-4 flex flex-col gap-3">
            <h2 className="font-bold">Config</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888]">Cartas para ganar</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setCardsToWin(v => Math.max(1, v - 1))} className="btn-secondary w-9 h-9 p-0">−</button>
                <span className="font-bold w-4 text-center">{cardsToWin}</span>
                <button onClick={() => setCardsToWin(v => Math.min(20, v + 1))} className="btn-secondary w-9 h-9 p-0">+</button>
              </div>
            </div>
            <div className="flex gap-2">
              {(['discard', 'replay'] as TieAction[]).map(a => (
                <button key={a} onClick={() => setTieAction(a)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${tieAction === a ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'border-white/20'}`}>
                  {a === 'discard' ? 'Descartar en empate' : 'Repetir en empate'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 3 || enabledCatIds.length === 0 || starting}
            className="btn-primary text-lg py-4"
          >
            {starting ? 'Iniciando...' : 'Iniciar partida'}
          </button>
        </>
      )}

      {!isHost && (
        <div className="text-center text-[#888] py-8">
          Esperando que el host inicie la partida...
        </div>
      )}
    </div>
  )
}
