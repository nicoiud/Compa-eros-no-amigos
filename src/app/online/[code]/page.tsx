'use client'
import { use, useEffect, useState } from 'react'
import { useOnlineGame } from '@/hooks/useOnlineGame'
import { createClient } from '@/lib/supabase/client'
import { Room } from '@/types/game'
import OnlineLobbyRoom from '../components/OnlineLobbyRoom'
import OnlineGame from '../components/OnlineGame'

interface Props {
  params: Promise<{ code: string }>
}

export default function OnlineRoomPage({ params }: Props) {
  const { code } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem(`player_id_${code}`)
    setPlayerId(id)

    const supabase = createClient()
    supabase.from('rooms').select('*').eq('code', code).single().then(({ data }) => {
      if (!data) { setNotFound(true); return }
      setRoom(data as unknown as Room)
    })
  }, [code])

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
      <p className="text-2xl font-bold">Sala no encontrada</p>
      <a href="/online" className="btn-primary px-6 py-3">Volver</a>
    </div>
  )

  if (!room || !playerId) return (
    <div className="min-h-screen flex items-center justify-center text-[#888]">Conectando...</div>
  )

  if (room.status === 'lobby') {
    return <OnlineLobbyRoom room={room} playerId={playerId} />
  }

  return <OnlineGame room={room} playerId={playerId} />
}
