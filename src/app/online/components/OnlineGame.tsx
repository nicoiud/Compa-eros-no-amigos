'use client'
import { useOnlineGame } from '@/hooks/useOnlineGame'
import { Room } from '@/types/game'
import CreateCardModal from '@/app/local/components/CreateCardModal'
import GameCard, { MiniCard } from '@/components/GameCard'
import { RoundHeadline, ChoiceBreakdown } from '@/components/RoundSummary'
import { cardType, choicesFor, turnPlayerVotes } from '@/lib/game/cardTypes'
import { useState } from 'react'

interface Props {
  room: Room
  playerId: string
}

export default function OnlineGame({ room, playerId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const {
    game, categories, loading,
    mePlayer, currentTurnPlayer, isMyTurn, alreadyVoted, allVotesCast,
    hostRevealCard, hostStartVoting, castVote, hostResolveRound, hostNextTurn,
  } = useOnlineGame({ roomId: room.id, roomCode: room.code, playerId, isHost: false })

  if (loading || !game) return (
    <div className="min-h-screen flex items-center justify-center text-[#888]">Cargando partida...</div>
  )

  const isHost = mePlayer?.is_host ?? false
  // Saca la carta y arranca la votación quien tiene el turno (o el host, por si se colgó)
  const canDrive = isHost || isMyTurn
  const sorted = [...game.players].sort((a, b) => b.cards_won - a.cards_won)
  const categoryOf = (categoryId?: string) => categories.find(c => c.id === categoryId)

  // ── CARD REVEAL ────────────────────────────────────────────
  if (game.phase === 'card_reveal') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-lg mx-auto">
        <div className="text-center">
          <p className="text-[#888] text-sm uppercase tracking-widest mb-1">Ronda {game.round} · Le toca a</p>
          <p className="text-2xl font-black text-[#c8ff00]">{isMyTurn ? 'Vos' : currentTurnPlayer?.name}</p>
        </div>

        <GameCard
          card={game.currentCard}
          category={categoryOf(game.currentCard?.category_id)}
          onDraw={canDrive ? hostRevealCard : undefined}
          drawLabel={canDrive ? 'Tocá para sacar carta' : `Esperando que ${currentTurnPlayer?.name} saque la carta...`}
        />

        <div className="w-full max-w-[300px] min-h-14 flex items-center justify-center">
          {game.currentCard ? (
            canDrive
              ? <button onClick={hostStartVoting} className="btn-primary text-lg w-full">¡Listo, a votar!</button>
              : <p className="text-[#888] text-sm text-center">Esperando que arranque la votación...</p>
          ) : (
            canDrive && <button onClick={hostRevealCard} className="btn-secondary text-lg w-full">Sacar carta</button>
          )}
        </div>
      </div>
    )
  }

  // ── VOTING ─────────────────────────────────────────────────
  if (game.phase === 'voting') {
    const type = cardType(game.currentCard)
    // En "¿Quién...?" no vota el del turno; en "¿Qué preferís?" y "Yo nunca" contestan todos
    const voters = turnPlayerVotes(game.currentCard) ? game.players : game.players.filter(p => p.id !== currentTurnPlayer?.id)
    const voteCount = Object.keys(game.votes).length

    return (
      <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-1">{type === 'quien' ? '¡A votar!' : type === 'preferis' ? '¿Qué preferís?' : '¿Lo hiciste?'}</h2>
          <p className="text-[#888] text-sm">
            {voteCount} de {voters.length} votos{type !== 'quien' && ' · la minoría se lleva la carta'}
          </p>
        </div>

        {game.currentCard && (
          <MiniCard card={game.currentCard} category={categoryOf(game.currentCard.category_id)} />
        )}

        {type === 'quien' && mePlayer?.id === currentTurnPlayer?.id ? (
          <div className="card-surface p-6 text-center text-[#888]">
            Vos preguntaste — esperá los votos del resto
          </div>
        ) : alreadyVoted ? (
          <div className="card-surface p-6 text-center">
            <p className="text-[#c8ff00] font-bold text-lg">¡Voto registrado!</p>
            <p className="text-[#888] text-sm mt-1">Esperando al resto... ({voteCount}/{voters.length})</p>
          </div>
        ) : type !== 'quien' && game.currentCard ? (
          <div className={`flex gap-2 ${type === 'preferis' ? 'flex-col' : ''}`}>
            {choicesFor(game.currentCard).map((choice, i) => (
              <button
                key={choice.value}
                onClick={() => castVote(choice.value)}
                className={`flex-1 px-4 py-4 rounded-xl font-semibold border border-white/20 hover:border-[#c8ff00] hover:text-[#c8ff00] transition-colors ${type === 'preferis' ? 'text-left' : ''}`}
              >
                {type === 'preferis' && <span className="font-black mr-2">{i === 0 ? 'A' : 'B'}</span>}
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="card-surface p-4 flex flex-col gap-3">
            <h3 className="font-bold">¿A quién votás?</h3>
            <div className="flex flex-wrap gap-2">
              {game.players
                .filter(p => p.id !== mePlayer?.id)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => castVote(p.id)}
                    className="px-4 py-3 rounded-xl font-semibold border border-white/20 hover:border-[#c8ff00] hover:text-[#c8ff00] transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {isHost && allVotesCast && (
          <button onClick={hostResolveRound} className="btn-primary text-lg py-4 mt-auto">Ver resultados</button>
        )}
        {isHost && !allVotesCast && (
          <p className="text-center text-[#888] text-sm">Esperando votos... ({voteCount}/{voters.length})</p>
        )}
      </div>
    )
  }

  // ── ROUND RESULT ───────────────────────────────────────────
  if (game.phase === 'round_result' && game.roundResult) {
    const { roundResult } = game
    const playerMap = Object.fromEntries(game.players.map(p => [p.id, p.name]))

    return (
      <div className="min-h-screen flex flex-col p-6 gap-5 max-w-lg mx-auto">
        <MiniCard
          card={roundResult.card}
          category={categoryOf(roundResult.card.category_id)}
          label="La pregunta fue"
        />

        <RoundHeadline
          card={roundResult.card}
          winnerNames={(roundResult.winnerIds ?? []).map(id => playerMap[id] ?? id)}
          isTie={roundResult.isTie}
        />

        {cardType(roundResult.card) !== 'quien' ? (
          <ChoiceBreakdown card={roundResult.card} votes={game.votes} nameOf={id => playerMap[id] ?? id} />
        ) : (
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
        )}

        <div className="card-surface p-4 flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888]">Puntaje</h3>
          {sorted.map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <span className="font-semibold">{p.name}</span>
              <span className="text-[#c8ff00] font-bold">{p.cards_won}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {isHost && <button onClick={hostNextTurn} className="btn-primary text-lg py-4">Siguiente turno →</button>}
          {!isHost && <p className="text-center text-[#888] text-sm">Esperando que el host continúe...</p>}
          <button onClick={() => setShowModal(true)} className="btn-secondary text-sm">+ Crear pregunta</button>
        </div>

        {showModal && <CreateCardModal categories={categories} onClose={() => setShowModal(false)} />}
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#888]">Ranking final</h2>
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
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
