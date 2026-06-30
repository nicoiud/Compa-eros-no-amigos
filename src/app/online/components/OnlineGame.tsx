'use client'
import { useOnlineGame } from '@/hooks/useOnlineGame'
import { Room } from '@/types/game'
import CreateCardModal from '@/app/local/components/CreateCardModal'
import { useState } from 'react'

interface Props {
  room: Room
  playerId: string
}

export default function OnlineGame({ room, playerId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const {
    game,
    categories,
    loading,
    mePlayer,
    currentTurnPlayer,
    isMyTurn,
    alreadyVoted,
    allVotesCast,
    hostRevealCard,
    hostStartVoting,
    castVote,
    hostResolveRound,
    hostNextTurn,
  } = useOnlineGame({ roomId: room.id, roomCode: room.code, playerId, isHost: false })

  if (loading || !game) return (
    <div className="min-h-screen flex items-center justify-center text-[#888]">Cargando partida...</div>
  )

  const isHost = mePlayer?.is_host ?? false
  const sorted = [...game.players].sort((a, b) => b.cards_won - a.cards_won)

  // ── CARD REVEAL ────────────────────────────────────────────
  if (game.phase === 'card_reveal') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-lg mx-auto">
        <div className="text-center">
          <p className="text-[#888] text-sm">Ronda {game.round} · Le toca a</p>
          <p className="text-2xl font-black text-[#c8ff00]">{currentTurnPlayer?.name}</p>
        </div>

        {game.currentCard ? (
          <div className="card-surface p-8 w-full flex flex-col items-center gap-6">
            <p className="text-2xl font-bold text-center leading-snug">{game.currentCard.text}</p>
            {isHost && (
              <button onClick={hostStartVoting} className="btn-primary w-full">¡A votar!</button>
            )}
          </div>
        ) : (
          <div className="card-surface p-8 w-full text-center">
            {isHost ? (
              <button onClick={hostRevealCard} className="btn-primary text-lg px-10">Sacar carta</button>
            ) : (
              <p className="text-[#888]">Esperando que {currentTurnPlayer?.name} saque la carta...</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── VOTING ─────────────────────────────────────────────────
  if (game.phase === 'voting') {
    const voters = game.players.filter(p => p.player_id !== currentTurnPlayer?.player_id)
    const myVotesLeft = !alreadyVoted && mePlayer?.player_id !== currentTurnPlayer?.player_id
    const voteCount = Object.keys(game.votes).length

    return (
      <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-1">¡A votar!</h2>
          <p className="text-[#888] text-sm">{voteCount} de {voters.length} votos</p>
        </div>

        {game.currentCard && (
          <div className="card-surface p-4 text-center">
            <p className="font-semibold">{game.currentCard.text}</p>
          </div>
        )}

        {mePlayer?.player_id === currentTurnPlayer?.player_id ? (
          <div className="card-surface p-6 text-center text-[#888]">
            Vos preguntaste — no podés votar en esta ronda
          </div>
        ) : alreadyVoted ? (
          <div className="card-surface p-6 text-center">
            <p className="text-[#c8ff00] font-bold text-lg">¡Voto registrado!</p>
            <p className="text-[#888] text-sm mt-1">Esperando al resto...</p>
          </div>
        ) : (
          <div className="card-surface p-4 flex flex-col gap-3">
            <h3 className="font-bold">¿A quién votás?</h3>
            <div className="flex flex-wrap gap-2">
              {game.players
                .filter(p => p.player_id !== mePlayer?.player_id)
                .map(p => (
                  <button
                    key={p.player_id}
                    onClick={() => castVote(p.player_id)}
                    className="px-4 py-3 rounded-xl font-semibold border border-white/20 hover:border-[#c8ff00] hover:text-[#c8ff00] transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {isHost && allVotesCast && (
          <button onClick={hostResolveRound} className="btn-primary text-lg py-4">Ver resultados</button>
        )}
      </div>
    )
  }

  // ── ROUND RESULT ───────────────────────────────────────────
  if (game.phase === 'round_result' && game.roundResult) {
    const { roundResult } = game
    const winnerPlayer = roundResult.winnerId ? game.players.find(p => p.player_id === roundResult.winnerId) : null
    const playerMap = Object.fromEntries(game.players.map(p => [p.player_id, p.name]))

    return (
      <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
        <div className="card-surface p-4 text-center">
          <p className="text-xs text-[#888] uppercase tracking-widest mb-2">La pregunta fue</p>
          <p className="font-semibold">{roundResult.card.text}</p>
        </div>

        <div className="card-surface p-6 text-center">
          {roundResult.isTie ? (
            <><div className="text-4xl mb-2">🤝</div><h2 className="text-2xl font-black">¡Empate!</h2></>
          ) : winnerPlayer ? (
            <><div className="text-4xl mb-2">🏆</div><p className="text-[#888] text-sm mb-1">Ganó la carta</p><h2 className="text-3xl font-black text-[#c8ff00]">{winnerPlayer.name}</h2></>
          ) : null}
        </div>

        <div className="card-surface p-4 flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888]">Votos</h3>
          {Object.entries(roundResult.tally).sort(([,a],[,b]) => b-a).map(([id, count]) => (
            <div key={id} className="flex items-center gap-2">
              <span className="flex-1 font-semibold">{playerMap[id] ?? id}</span>
              <span className="text-[#c8ff00]">{'●'.repeat(count)}</span>
              <span className="text-[#888] text-sm">{count}</span>
            </div>
          ))}
        </div>

        <div className="card-surface p-4 flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888]">Puntaje</h3>
          {sorted.map(p => (
            <div key={p.player_id} className="flex items-center justify-between">
              <span className="font-semibold">{p.name}</span>
              <span className="text-[#c8ff00] font-bold">{p.cards_won}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {isHost && (
            <button onClick={hostNextTurn} className="btn-primary text-lg py-4">Siguiente turno →</button>
          )}
          <button onClick={() => setShowModal(true)} className="btn-secondary text-sm">+ Crear pregunta</button>
        </div>

        {showModal && (
          <CreateCardModal categories={categories} onClose={() => setShowModal(false)} />
        )}
      </div>
    )
  }

  // ── FINISHED ───────────────────────────────────────────────
  if (game.phase === 'finished') {
    const MEDALS = ['🥇','🥈','🥉']
    return (
      <div className="min-h-screen flex flex-col items-center p-6 gap-6 max-w-lg mx-auto">
        <div className="text-center pt-8">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-[#888] text-sm mb-1">Ganó la partida</p>
          <h1 className="text-4xl font-black text-[#c8ff00]">{sorted[0]?.name}</h1>
        </div>
        <div className="card-surface w-full p-5 flex flex-col gap-3">
          {sorted.map((p, i) => (
            <div key={p.player_id} className="flex items-center gap-3">
              <span className="text-xl w-8">{MEDALS[i] ?? `${i+1}.`}</span>
              <span className="flex-1 font-semibold">{p.name}</span>
              <span className="text-[#888]">{p.cards_won} cartas</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-secondary w-full">+ Crear pregunta</button>
        <a href="/" className="text-[#888] text-sm">Volver al inicio</a>
        {showModal && <CreateCardModal categories={categories} onClose={() => setShowModal(false)} />}
      </div>
    )
  }

  return null
}
