'use client'
import { useLocalGame } from '@/hooks/useLocalGame'
import SetupForm from './components/SetupForm'
import CardReveal from './components/CardReveal'
import VotingPanel from './components/VotingPanel'
import RoundResult from './components/RoundResult'
import FinalScreen from './components/FinalScreen'

export default function LocalPage() {
  const {
    game,
    categories,
    loading,
    currentPlayer,
    allVotesCast,
    startGame,
    revealCard,
    startVoting,
    castVote,
    resolveRound,
    nextTurn,
    resetGame,
  } = useLocalGame()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#888]">
        Cargando...
      </div>
    )
  }

  if (game.phase === 'setup') {
    return (
      <SetupForm
        categories={categories}
        onStart={(names, catIds, cardsToWin, tieAction) =>
          startGame(names, catIds, cardsToWin, tieAction)
        }
      />
    )
  }

  if (game.phase === 'card_reveal') {
    return (
      <CardReveal
        card={game.currentCard}
        currentPlayer={currentPlayer}
        round={game.round}
        onRevealCard={revealCard}
        onStartVoting={startVoting}
      />
    )
  }

  if (game.phase === 'voting') {
    return (
      <VotingPanel
        players={game.players}
        currentPlayer={currentPlayer}
        votes={game.votes}
        onCastVote={castVote}
        onResolve={resolveRound}
        allVotesCast={allVotesCast}
      />
    )
  }

  if (game.phase === 'round_result' && game.roundResult) {
    return (
      <RoundResult
        result={game.roundResult}
        players={game.players}
        cardsToWin={game.cardsToWin}
        onNextTurn={nextTurn}
        categories={categories}
      />
    )
  }

  if (game.phase === 'finished') {
    return (
      <FinalScreen
        players={game.players}
        cardsToWin={game.cardsToWin}
        onPlayAgain={resetGame}
        categories={categories}
      />
    )
  }

  return null
}
