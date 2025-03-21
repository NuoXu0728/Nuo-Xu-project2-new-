import { createContext, useContext } from 'react'
import React from 'react'
import { Game } from './GameClasses'
import { GameTimer } from './GameTimer'

// Initialize context
const UniverseContext = createContext()

/**
 * 游戏宇宙上下文提供者 - 类组件实现
 */
export class UniverseProvider extends React.Component {
  constructor(props) {
    super(props)

    // 从本地存储恢复状态
    const savedState = localStorage.getItem('cosmicBattleState')
    let game

    try {
      game = savedState ? Game.fromObject(JSON.parse(savedState)) : new Game()
    } catch (error) {
      console.error('加载游戏状态失败:', error)
      game = new Game()
    }

    // 创建游戏计时器
    this.gameTimer = new GameTimer()

    // 初始化状态
    this.state = {
      game: game,
      elapsedTime: 0
    }

    // 绑定方法
    this.dispatch = this.dispatch.bind(this)
    this.resetElapsedTime = this.resetElapsedTime.bind(this)
    this.handleTimerTick = this.handleTimerTick.bind(this)
  }

  /**
   * 组件挂载后的处理
   */
  componentDidMount() {
    // 开始计时器
    if (!this.state.game.gameFinished) {
      this.gameTimer.start(this.handleTimerTick)
    }
  }

  /**
   * 组件更新后的处理
   */
  componentDidUpdate(prevProps, prevState) {
    const { game } = this.state
    const prevGame = prevState.game

    // 保存状态到本地存储
    if (!game.gameFinished) {
      localStorage.setItem('cosmicBattleState', JSON.stringify(game.toObject()))
    }

    // 游戏状态变化时更新计时器
    if (prevGame.gameFinished !== game.gameFinished) {
      if (game.gameFinished) {
        this.gameTimer.pause()
      } else {
        this.gameTimer.resume()
      }
    }
  }

  /**
   * 组件卸载时清理
   */
  componentWillUnmount() {
    this.gameTimer.stop()
  }

  /**
   * 处理计时器回调
   */
  handleTimerTick(elapsedTime) {
    this.setState({ elapsedTime })
  }

  /**
   * 分发游戏动作
   * @param {Object} action 动作对象
   */
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

    // 更新状态
    this.setState({ game: updatedGame })

    // 如果电脑回合，安排电脑攻击
    if (updatedGame.activePlayer === 'computer' && !updatedGame.gameFinished) {
      setTimeout(() => {
        this.dispatch({ type: 'COMPUTER_ATTACK' })
      }, 1000)
    }
  }

  /**
   * 重置计时器
   */
  resetElapsedTime() {
    this.gameTimer.reset()
    this.setState({ elapsedTime: 0 })
  }

  /**
   * 转换游戏状态为兼容格式
   * 保持与旧API兼容，以便无需修改其他组件
   */
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

// Custom hook for accessing context
export const useUniverseContext = () => useContext(UniverseContext)
