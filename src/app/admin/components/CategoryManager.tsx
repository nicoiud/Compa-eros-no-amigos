'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/game'

interface Props {
  categories: Category[]
  onReload: () => void
}

const EMPTY = { name: '', slug: '', is_adult: false, sort_order: 0 }

export default function CategoryManager({ categories, onReload }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(cat: Category) {
    setEditId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, is_adult: cat.is_adult, sort_order: cat.sort_order })
    setError('')
  }

  function cancel() {
    setEditId(null)
    setForm(EMPTY)
    setError('')
  }

  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Nombre y slug son obligatorios')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = { name: form.name.trim(), slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'), is_adult: form.is_adult, sort_order: form.sort_order }
    const { error: err } = editId
      ? await supabase.from('categories').update(payload).eq('id', editId)
      : await supabase.from('categories').insert({ ...payload, active: true })
    setSaving(false)
    if (err) { setError(err.message); return }
    cancel()
    onReload()
  }

  async function toggleActive(cat: Category) {
    const supabase = createClient()
    await supabase.from('categories').update({ active: !cat.active }).eq('id', cat.id)
    onReload()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Formulario */}
      <div className="card-surface p-5 flex flex-col gap-3">
        <h2 className="font-bold">{editId ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <input
          className="bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50"
          placeholder="Nombre (ej: Clásico)"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="bg-[#242424] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c8ff00]/50"
          placeholder="Slug (ej: clasico)"
          value={form.slug}
          onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
        />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_adult} onChange={e => setForm(f => ({ ...f, is_adult: e.target.checked }))} className="w-4 h-4 accent-[#c8ff00]" />
            <span className="text-sm">Solo mayores de edad (+18)</span>
          </label>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-[#888]">Orden</label>
            <input
              type="number"
              className="bg-[#242424] rounded-xl px-3 py-2 w-16 outline-none"
              value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Crear categoría'}</button>
          {editId && <button onClick={cancel} className="btn-secondary">Cancelar</button>}
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2">
        {categories.map(cat => (
          <div key={cat.id} className={`card-surface p-4 flex items-center gap-3 ${!cat.active ? 'opacity-50' : ''}`}>
            <div className="flex-1">
              <div className="font-semibold">{cat.is_adult ? '🔞 ' : ''}{cat.name}</div>
              <div className="text-xs text-[#888]">/{cat.slug} · orden {cat.sort_order}</div>
            </div>
            <button onClick={() => startEdit(cat)} className="text-xs px-3 py-1 rounded-lg bg-[#242424] hover:bg-[#333]">Editar</button>
            <button onClick={() => toggleActive(cat)} className={`text-xs px-3 py-1 rounded-lg ${cat.active ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-green-900/40 text-green-400 hover:bg-green-900/60'}`}>
              {cat.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
