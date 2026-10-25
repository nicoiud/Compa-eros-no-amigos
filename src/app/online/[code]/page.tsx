'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room } from '@/types/game'
import OnlineLobbyRoom from '../components/OnlineLobbyRoom'
import OnlineGame from '../components/OnlineGame'

// En Next.js 14 `params` es un objeto plano (recién en Next 15 pasa a ser una Promise)
interface Props {
  params: { code: string }
}

export default function OnlineRoomPage({ params }: Props) {
  const { code } = params
  const [room, setRoom] = useState<Room | null>(null)
  // undefined = todavía no leímos localStorage; null = este dispositivo no está en la sala
  const [playerId, setPlayerId] = useState<string | null | undefined>(undefined)
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

  if (playerId === null) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
      <p className="text-2xl font-bold">No estás en la sala {code}</p>
      <p className="text-[#888]">Entrá desde &quot;Unirse a sala&quot; con este código.</p>
      <a href="/online" className="btn-primary px-6 py-3">Unirme</a>
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
