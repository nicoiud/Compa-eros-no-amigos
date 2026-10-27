'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/game'
import CardFields, { CardDraft, EMPTY_DRAFT, draftColumns, draftError } from '@/components/CardFields'
import { typeForCategory } from '@/lib/game/cardTypes'

interface Props {
  categories: Category[]
  onClose: () => void
  onCreated?: () => void
}

export default function CreateCardModal({ categories, onClose, onCreated }: Props) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [draft, setDraft] = useState<CardDraft>({ ...EMPTY_DRAFT, type: typeForCategory(categories[0]?.slug) })
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    const problem = categoryId ? draftError(draft) : 'Elegí una categoría'
    if (problem) {
      setError(problem)
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.from('cards').insert({
      ...draftColumns(draft),
      category_id: categoryId,
      visibility,
      moderation_status: visibility === 'public' ? 'pending' : 'approved',
      active: true,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    onCreated?.()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="card-surface w-full max-w-lg p-6 flex flex-col gap-4 rounded-2xl">
        {success ? (
          <div className="text-center py-6 flex flex-col gap-4">
            <div className="text-4xl">✅</div>
            <h3 className="text-xl font-bold">¡Pregunta creada!</h3>
            {visibility === 'public' && (
              <p className="text-[#888] text-sm">Quedó pendiente de revisión. Un admin la aprobará antes de que aparezca en el mazo público.</p>
            )}
            <button onClick={onClose} className="btn-primary">Cerrar</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Crear pregunta</h3>
              <button onClick={onClose} className="text-[#888] hover:text-white text-xl">✕</button>
            </div>

            <select
              className="bg-[#242424] rounded-xl px-4 py-3 outline-none"
              value={categoryId}
              onChange={e => {
                const slug = categories.find(c => c.id === e.target.value)?.slug
                setCategoryId(e.target.value)
                setDraft(d => ({ ...d, type: typeForCategory(slug) }))
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <CardFields draft={draft} onChange={d => { setDraft(d); setError('') }} autoFocus />

            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#888]">¿Querés que otros la usen?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibility('private')}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${visibility === 'private' ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'border-white/20 text-white'}`}
                >
                  Solo para mí
                </button>
                <button
                  onClick={() => setVisibility('public')}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${visibility === 'public' ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'border-white/20 text-white'}`}
                >
                  Enviar para revisión
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button onClick={submit} disabled={saving} className="btn-primary text-base">
              {saving ? 'Guardando...' : 'Crear pregunta'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
