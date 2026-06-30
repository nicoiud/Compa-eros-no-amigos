'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function OnlineLobby() {
  const router = useRouter()
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function createRoom() {
    if (!name.trim()) { setError('Ingresá tu nombre'); return }
    setLoading(true)
    const supabase = createClient()
    const playerId = crypto.randomUUID()
    const roomCode = generateCode()

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .insert({ code: roomCode, mode: 'online', status: 'lobby' })
      .select()
      .single()

    if (roomErr) { setError(roomErr.message); setLoading(false); return }

    await supabase.from('players').insert({
      room_id: room.id,
      name: name.trim(),
      is_host: true,
      player_id: playerId,
    })

    localStorage.setItem(`player_id_${roomCode}`, playerId)
    router.push(`/online/${roomCode}`)
  }

  async function joinRoom() {
    if (!name.trim()) { setError('Ingresá tu nombre'); return }
    if (!code.trim()) { setError('Ingresá el código de sala'); return }
    setLoading(true)
    const supabase = createClient()
    const upperCode = code.trim().toUpperCase()

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', upperCode)
      .single()

    if (roomErr || !room) { setError('Sala no encontrada'); setLoading(false); return }
    if (room.status === 'finished') { setError('Esta partida ya terminó'); setLoading(false); return }

    // Verificar nombre duplicado
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('room_id', room.id)
      .eq('name', name.trim())
      .maybeSingle()

    if (existing) { setError('Ese nombre ya está en uso en esta sala'); setLoading(false); return }

    const playerId = crypto.randomUUID()
    await supabase.from('players').insert({
      room_id: room.id,
      name: name.trim(),
      is_host: false,
      player_id: playerId,
    })

    localStorage.setItem(`player_id_${upperCode}`, playerId)
    router.push(`/online/${upperCode}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-black mb-1">Compa<span className="text-[#c8ff00]">ñeros</span></h1>
        <p className="text-[#888]">Modo Online</p>
      </div>

      {mode === 'menu' && (
        <div className="w-full flex flex-col gap-3">
          <button onClick={() => setMode('create')} className="btn-primary text-lg py-4">Crear sala</button>
          <button onClick={() => setMode('join')} className="btn-secondary text-lg py-4">Unirse a sala</button>
          <a href="/" className="text-center text-[#888] text-sm mt-2">← Volver</a>
        </div>
      )}

      {(mode === 'create' || mode === 'join') && (
        <div className="w-full card-surface p-6 flex flex-col gap-4">
          <h2 className="font-bold text-lg">{mode === 'create' ? 'Crear sala' : 'Unirse a sala'}</h2>

          <input
            className="bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50"
            placeholder="Tu nombre"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            maxLength={24}
          />

          {mode === 'join' && (
            <input
              className="bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50 uppercase tracking-widest text-center text-xl font-bold"
              placeholder="CÓDIGO"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
              maxLength={4}
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={mode === 'create' ? createRoom : joinRoom}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Conectando...' : mode === 'create' ? 'Crear sala' : 'Entrar'}
          </button>
          <button onClick={() => { setMode('menu'); setError('') }} className="text-[#888] text-sm">← Volver</button>
        </div>
      )}
    </div>
  )
}
