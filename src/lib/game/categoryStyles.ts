// Emoji y color de cada categoría, por slug. Las categorías creadas desde el
// admin que no estén acá usan el estilo por defecto.
const STYLES: Record<string, { emoji: string; color: string }> = {
  clasico:             { emoji: '🎲', color: '#c8ff00' },
  hot:                 { emoji: '🌶️', color: '#ff4d6d' },
  'que-preferis':      { emoji: '⚖️', color: '#4dabf7' },
  'que-preferis-hot':  { emoji: '🔥', color: '#ff8787' },
  'yo-nunca':          { emoji: '🙊', color: '#ffe066' },
  'yo-nunca-hot':      { emoji: '🫣', color: '#e64980' },
  trabajo:             { emoji: '💼', color: '#ffa94d' },
  verguenzas:          { emoji: '🙈', color: '#f783ac' },
  aventuras:           { emoji: '🧭', color: '#38d9a9' },
  familia:             { emoji: '🏡', color: '#ffd43b' },
  tecnologia:          { emoji: '📱', color: '#9775fa' },
  fiesta:              { emoji: '🎉', color: '#da77f2' },
  amistad:             { emoji: '🤝', color: '#3bc9db' },
  comunidad:           { emoji: '💬', color: '#adb5bd' },
}

const FALLBACK = { emoji: '🃏', color: '#c8ff00' }

export function categoryStyle(slug?: string | null) {
  return (slug && STYLES[slug]) || FALLBACK
}
