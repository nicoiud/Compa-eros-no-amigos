'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category, Card } from '@/types/game'

interface Props {
  cards: Card[]
  categories: Category[]
  onReload: () => void
}

export default function CardManager({ cards, categories, onReload }: Props) {
  const [form, setForm] = useState({ text: '', category_id: '', visibility: 'official' as Card['visibility'] })
  const [editId, setEditId] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(card: Card) {
    setEditId(card.id)
    setForm({ text: card.text, category_id: card.category_id, visibility: card.visibility })
    setError('')
  }

  function cancel() {
    setEditId(null)
    setForm({ text: '', category_id: '', visibility: 'official' })
    setError('')
  }

  async function save() {
    if (!form.text.trim() || !form.category_id) {
      setError('Texto y categoría son obligatorios')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = { text: form.text.trim(), category_id: form.category_id, visibility: form.visibility, moderation_status: 'approved' as const, active: true }
    const { error: err } = editId
      ? await supabase.from('cards').update(payload).eq('id', editId)
      : await supabase.from('cards').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    cancel()
    onReload()
  }

  async function toggleActive(card: Card) {
    const supabase = createClient()
    await supabase.from('cards').update({ active: !card.active }).eq('id', card.id)
    onReload()
  }

  async function setModerationStatus(card: Card, status: Card['moderation_status']) {
    const supabase = createClient()
    await supabase.from('cards').update({ moderation_status: status }).eq('id', card.id)
    onReload()
  }

  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  const filtered = cards.filter(c => {
    if (filterCat && c.category_id !== filterCat) return false
    if (filterStatus && c.moderation_status !== filterStatus) return false
    if (search && !c.text.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pending = cards.filter(c => c.moderation_status === 'pending').length

  return (
    <div className="flex flex-col gap-4">
      {/* Formulario */}
      <div className="card-surface p-5 flex flex-col gap-3">
        <h2 className="font-bold">{editId ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
        <textarea
          className="bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50 resize-none"
          placeholder="¿Quién sería el primero en...?"
          rows={3}
          maxLength={200}
          value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
        />
        <div className="flex justify-between gap-3">
          <p className="text-xs text-[#555]">Tip: escribí {'{jugador}'} y el juego pone el nombre de alguien de la ronda.</p>
          <span className="text-xs text-[#555] shrink-0">{form.text.length}/200</span>
        </div>
        <select
          className="bg-[#242424] rounded-xl px-4 py-3 outline-none"
          value={form.category_id}
          onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
        >
          <option value="">— Elegir categoría —</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="bg-[#242424] rounded-xl px-4 py-3 outline-none"
          value={form.visibility}
          onChange={e => setForm(f => ({ ...f, visibility: e.target.value as Card['visibility'] }))}
        >
          <option value="official">Official (mazo general)</option>
          <option value="public">Public (enviada por usuario, aprobada)</option>
          <option value="private">Private (solo del usuario)</option>
        </select>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Crear pregunta'}</button>
          {editId && <button onClick={cancel} className="btn-secondary">Cancelar</button>}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <input
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-[140px]"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="approved">Aprobadas</option>
          <option value="pending">Pendientes {pending > 0 ? `(${pending})` : ''}</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      <p className="text-sm text-[#888]">{filtered.length} pregunta{filtered.length !== 1 ? 's' : ''}</p>

      {/* Lista */}
      <div className="flex flex-col gap-2">
        {filtered.map(card => {
          const cat = catMap[card.category_id]
          return (
            <div key={card.id} className={`card-surface p-4 flex flex-col gap-2 ${!card.active ? 'opacity-50' : ''}`}>
              <p className="font-medium leading-snug">{card.text}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[#242424] px-2 py-1 rounded-lg text-[#888]">{cat?.name ?? '—'}</span>
                <span className={`px-2 py-1 rounded-lg font-semibold ${
                  card.moderation_status === 'approved' ? 'bg-green-900/40 text-green-400' :
                  card.moderation_status === 'pending'  ? 'bg-yellow-900/40 text-yellow-400' :
                                                          'bg-red-900/40 text-red-400'
                }`}>{card.moderation_status}</span>
                <span className="text-[#555]">{card.visibility}</span>
                <div className="ml-auto flex gap-2">
                  {card.moderation_status === 'pending' && (
                    <>
                      <button onClick={() => setModerationStatus(card, 'approved')} className="px-3 py-1 rounded-lg bg-green-900/40 text-green-400 hover:bg-green-900/60">Aprobar</button>
                      <button onClick={() => setModerationStatus(card, 'rejected')} className="px-3 py-1 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60">Rechazar</button>
                    </>
                  )}
                  <button onClick={() => startEdit(card)} className="px-3 py-1 rounded-lg bg-[#242424] hover:bg-[#333]">Editar</button>
                  <button onClick={() => toggleActive(card)} className={`px-3 py-1 rounded-lg ${card.active ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
                    {card.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
