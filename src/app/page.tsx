import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-black mb-2 tracking-tight">
          Compa<span className="text-[#c8ff00]">ñeros</span>
        </h1>
        <p className="text-[#888] text-lg">¿Quién de nosotros sería el primero en...?</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Link href="/local" className="block">
          <div className="card-surface p-6 hover:border-[#c8ff00]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <div className="font-bold text-lg">Modo Local</div>
                <div className="text-[#888] text-sm">Un solo celular, el host maneja todo</div>
              </div>
              <span className="ml-auto text-[#c8ff00] text-xl">→</span>
            </div>
          </div>
        </Link>

        <Link href="/online" className="block">
          <div className="card-surface p-6 hover:border-[#c8ff00]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🌐</span>
              <div>
                <div className="font-bold text-lg">Modo Online</div>
                <div className="text-[#888] text-sm">Cada jugador desde su dispositivo</div>
              </div>
              <span className="ml-auto text-[#c8ff00] text-xl">→</span>
            </div>
          </div>
        </Link>

        <div className="card-surface p-6 opacity-40 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏠</span>
            <div>
              <div className="font-bold text-lg">Modo Presencial</div>
              <div className="text-[#888] text-sm">Cada uno ve su pantalla — próximamente</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
