import React from 'react'
import { useUniverseContext } from '../context/GameContext'
import Board from './Board'

const BattleContext = React.createContext()

class TimeFormatter {
  static format(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }
}

class FleetStatusCalculator {
  static calculate(grid) {
    if (!grid || !grid.length) return 0

    let intactCells = 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasVessel && !cell.wasStruck) {
          intactCells++
        }
      }
    }

    const totalCells = 17
    return Math.min(5, Math.ceil((intactCells / totalCells) * 5))
  }
}

class BattleScreen extends React.Component {
  static contextType = BattleContext

  constructor(props) {
    super(props)

    this.state = {
      aiTimer: null
    }
  }

  componentDidMount() {
    const { dispatch, resetElapsedTime } = this.context

    const gameType = this.isTrainingMode() ? 'training' : 'standard'
    dispatch({ type: 'START_GAME', payload: { type: gameType } })
    resetElapsedTime()
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleAITurn()
  }

  componentWillUnmount() {
    if (this.state.aiTimer) {
      clearTimeout(this.state.aiTimer)
    }
  }

  handleAITurn() {
    const { dispatch } = this.context

    if (!this.isPlayerTurn() && this.isGameActive() && !this.state.aiTimer) {
      const aiTimer = setTimeout(() => {
        dispatch({ type: 'COMPUTER_ATTACK' })
        this.setState({ aiTimer: null })
      }, 1000)

      this.setState({ aiTimer })
    }
  }

  isTrainingMode() {
    return this.props.mode !== 'normal'
  }

  isGameActive() {
    const { state } = this.context
    return !state.gameFinished
  }

  isPlayerTurn() {
    const { state } = this.context
    return state.activePlayer === 'human'
  }

  handleAttack = (row, col) => {
    const { dispatch } = this.context

    if (this.isPlayerTurn() && this.isGameActive()) {
      dispatch({ type: 'HUMAN_ATTACK', payload: { row, col } })
    }
  }

  resetGame = () => {
    const { dispatch, resetElapsedTime } = this.context

    dispatch({ type: 'RESET_GAME' })
    resetElapsedTime()
  }

  getGameStatus() {
    const { state, elapsedTime } = this.context
    const isTrainingMode = this.isTrainingMode()
    const isPlayerTurn = this.isPlayerTurn()

    return {
      title: isTrainingMode ? 'Training Mode' : 'Battleship Game',
      activePlayer: isPlayerTurn ? 'Player' : 'Enemy',
      timeDisplay: TimeFormatter.format(elapsedTime),
      victor: state.victor === 'Commander' ? 'Player' : 'Enemy',
      humanFleet: FleetStatusCalculator.calculate(state.humanGrid),
      computerFleet: FleetStatusCalculator.calculate(state.computerGrid)
    }
  }

  renderHeader(gameStatus) {
    return (
      <div className="battle-header">
        <h2>{gameStatus.title}</h2>
        <div className="battle-status">
          <span className="battle-timer">Time: {gameStatus.timeDisplay}</span>
          <span>Active: {gameStatus.activePlayer}</span>
          <button onClick={this.resetGame} className="reset-button">
            Reset Game
          </button>
        </div>
      </div>
    )
  }

  renderGameCompleteNotice(gameStatus) {
    const { state } = this.context

    if (!state.gameFinished) {
      return null
    }

    return (
      <div className="battle-complete">
        <h2>Game Over! {gameStatus.victor} Victory!</h2>
        <p>Duration: {gameStatus.timeDisplay}</p>
      </div>
    )
  }

  renderGameZones() {
    const { state } = this.context
    const isTrainingMode = this.isTrainingMode()

    return (
      <div className="combat-zones">
        <div className="enemy-zone">
          <h3>Enemy Board</h3>
          <Board
            isCommanderBoard={false}
            onCellClick={this.handleAttack}
            disabled={!this.isPlayerTurn() || state.gameFinished}
          />
        </div>

        {!isTrainingMode && (
          <div className="commander-zone">
            <h3>Player Board</h3>
            <Board isCommanderBoard={true} disabled={true} />
          </div>
        )}
      </div>
    )
  }

  renderGameCompleteModal(gameStatus) {
    const { state } = this.context

    if (!state.gameFinished) {
      return null
    }

    return (
      <div className="mission-complete-modal">
        <h2>{gameStatus.victor} Wins!</h2>
        <p>Game Time: {gameStatus.timeDisplay}</p>
        <button onClick={this.resetGame} className="reset-button">
          New Game
        </button>
      </div>
    )
  }

  renderFleetStatus(gameStatus) {
    return (
      <div className="fleet-status">
        <h3>Fleet Status</h3>
        <div>
          <p>Player Fleet: {gameStatus.humanFleet}/5</p>
          <p>Enemy Fleet: {gameStatus.computerFleet}/5</p>
        </div>
      </div>
    )
  }

  render() {
    const gameStatus = this.getGameStatus()

    return (
      <div className="battle-container">
        {this.renderHeader(gameStatus)}
        {this.renderGameCompleteNotice(gameStatus)}
        {this.renderGameZones()}
        {this.renderGameCompleteModal(gameStatus)}
        {this.renderFleetStatus(gameStatus)}
      </div>
    )
  }
}

const BattleScreenWithContext = props => {
  const universeContext = useUniverseContext()

  return (
    <BattleContext.Provider value={universeContext}>
      <BattleScreen {...props} />
    </BattleContext.Provider>
  )
}

export default BattleScreenWithContext
