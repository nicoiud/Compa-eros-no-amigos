'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category, Card } from '@/types/game'
import CategoryManager from './CategoryManager'
import CardManager from './CardManager'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'cards' | 'categories'>('cards')
  const [categories, setCategories] = useState<Category[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() {
    const supabase = createClient()
    const [{ data: cats }, { data: crds }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('cards').select('*').order('created_at', { ascending: false }),
    ])
    setCategories(cats ?? [])
    setCards(crds ?? [])
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#888]">
      Cargando...
    </div>
  )

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <a href="/" className="text-[#888] hover:text-white">← Volver</a>
        <h1 className="text-2xl font-black">Panel de Admin</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('cards')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'cards' ? 'bg-[#c8ff00] text-black' : 'bg-[#242424] text-white'}`}
        >
          Preguntas ({cards.length})
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'categories' ? 'bg-[#c8ff00] text-black' : 'bg-[#242424] text-white'}`}
        >
          Categorías ({categories.length})
        </button>
      </div>

      {tab === 'cards' && (
        <CardManager cards={cards} categories={categories} onReload={reload} />
      )}
      {tab === 'categories' && (
        <CategoryManager categories={categories} onReload={reload} />
      )}
    </div>
  )
}
