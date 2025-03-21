import { createContext, useContext } from 'react'
import React from 'react'
import { Game } from './GameClasses'
import { GameTimer } from './GameTimer'


const UniverseContext = createContext()

export class UniverseProvider extends React.Component {
  constructor(props) {
    super(props)

    
    const savedState = localStorage.getItem('cosmicBattleState')
    let game

    try {
      game = savedState ? Game.fromObject(JSON.parse(savedState)) : new Game()
    } catch (error) {
      console.error('加载游戏状态失败:', error)
      game = new Game()
    }

    
    this.gameTimer = new GameTimer()

    
    this.state = {
      game: game,
      elapsedTime: 0
    }

    
    this.dispatch = this.dispatch.bind(this)
    this.resetElapsedTime = this.resetElapsedTime.bind(this)
    this.handleTimerTick = this.handleTimerTick.bind(this)
  }

  componentDidMount() {
    
    if (!this.state.game.gameFinished) {
      this.gameTimer.start(this.handleTimerTick)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { game } = this.state
    const prevGame = prevState.game

    
    if (!game.gameFinished) {
      localStorage.setItem('cosmicBattleState', JSON.stringify(game.toObject()))
    }

    
    if (prevGame.gameFinished !== game.gameFinished) {
      if (game.gameFinished) {
        this.gameTimer.pause()
      } else {
        this.gameTimer.resume()
      }
    }
  }

  componentWillUnmount() {
    this.gameTimer.stop()
  }

  handleTimerTick(elapsedTime) {
    this.setState({ elapsedTime })
  }

  dispatch(action) {
    const { game } = this.state
    let updatedGame = game

    switch (action.type) {
      case 'START_GAME': {
        updatedGame = game.start(action.payload.type)
        this.resetElapsedTime()
        break
      }

      case 'HUMAN_ATTACK': {
        const { row, col } = action.payload
        game.humanAttack(row, col)
        updatedGame = game
        break
      }

      case 'COMPUTER_ATTACK': {
        game.computerAttack()
        updatedGame = game
        break
      }

      case 'RESET_GAME': {
        updatedGame = game.reset()
        this.resetElapsedTime()
        break
      }

      default:
        break
    }

    
    this.setState({ game: updatedGame })

    
    if (updatedGame.activePlayer === 'computer' && !updatedGame.gameFinished) {
      setTimeout(() => {
        this.dispatch({ type: 'COMPUTER_ATTACK' })
      }, 1000)
    }
  }

  resetElapsedTime() {
    this.gameTimer.reset()
    this.setState({ elapsedTime: 0 })
  }

  getCompatibleState() {
    const { game } = this.state

    return {
      humanGrid: game.humanGrid.cells.map(row =>
        row.map(cell => ({
          hasVessel: cell.hasVessel,
          wasStruck: cell.wasStruck,
          isExposed: cell.isExposed
        }))
      ),
      computerGrid: game.computerGrid.cells.map(row =>
        row.map(cell => ({
          hasVessel: cell.hasVessel,
          wasStruck: cell.wasStruck,
          isExposed: cell.isExposed
        }))
      ),
      gameType: game.gameType,
      gameFinished: game.gameFinished,
      victor: game.victor,
      activePlayer: game.activePlayer,
      vessels: game.vesselTypes.map(vessel => ({
        id: vessel.id,
        length: vessel.length,
        name: vessel.name,
        deployed: true
      }))
    }
  }

  render() {
    const { elapsedTime } = this.state
    const compatibleState = this.getCompatibleState()

    return (
      <UniverseContext.Provider
        value={{
          state: compatibleState,
          dispatch: this.dispatch,
          elapsedTime,
          resetElapsedTime: this.resetElapsedTime
        }}
      >
        {this.props.children}
      </UniverseContext.Provider>
    )
  }
}


export const useUniverseContext = () => useContext(UniverseContext)
