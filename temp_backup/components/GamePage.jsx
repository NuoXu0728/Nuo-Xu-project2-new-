import React from 'react'
import { useUniverseContext } from '../context/GameContext'
import Board from './Board'

// 创建战斗屏幕组件使用的上下文
const BattleContext = React.createContext()

/**
 * 格式化时间工具类
 */
class TimeFormatter {
  /**
   * 将秒数格式化为分:秒格式
   * @param {number} seconds 秒数
   * @returns {string} 格式化后的时间字符串
   */
  static format(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }
}

/**
 * 舰队状态计算器类
 */
class FleetStatusCalculator {
  /**
   * 计算剩余战舰比例
   * @param {Array<Array<Object>>} grid 棋盘格子数组
   * @returns {number} 剩余战舰数量估计值(0-5)
   */
  static calculate(grid) {
    if (!grid || !grid.length) return 0

    // 计算完好的单元格数
    let intactCells = 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasVessel && !cell.wasStruck) {
          intactCells++
        }
      }
    }

    // 总共17个单元格 (5+4+3+3+2)
    const totalCells = 17
    return Math.min(5, Math.ceil((intactCells / totalCells) * 5))
  }
}

/**
 * 战斗屏幕组件 - 游戏主界面
 */
class BattleScreen extends React.Component {
  /**
   * 使用上下文类型
   */
  static contextType = BattleContext

  constructor(props) {
    super(props)

    // 组件内部状态
    this.state = {
      aiTimer: null
    }
  }

  /**
   * 组件挂载后的处理
   */
  componentDidMount() {
    // 获取上下文
    const { dispatch, resetElapsedTime } = this.context

    // 游戏初始化
    const gameType = this.isTrainingMode() ? 'training' : 'standard'
    dispatch({ type: 'START_GAME', payload: { type: gameType } })
    resetElapsedTime()
  }

  /**
   * 组件更新后的处理
   */
  componentDidUpdate(prevProps, prevState) {
    this.handleAITurn()
  }

  /**
   * 组件卸载时清理
   */
  componentWillUnmount() {
    // 清理AI定时器
    if (this.state.aiTimer) {
      clearTimeout(this.state.aiTimer)
    }
  }

  /**
   * 处理AI回合
   */
  handleAITurn() {
    const { dispatch } = this.context

    // 如果当前是AI回合且游戏进行中
    if (!this.isPlayerTurn() && this.isGameActive() && !this.state.aiTimer) {
      // 设置AI定时器
      const aiTimer = setTimeout(() => {
        dispatch({ type: 'COMPUTER_ATTACK' })
        this.setState({ aiTimer: null })
      }, 1000)

      this.setState({ aiTimer })
    }
  }

  /**
   * 判断是否为训练模式
   * @returns {boolean} 如果是训练模式返回true
   */
  isTrainingMode() {
    return this.props.mode !== 'normal'
  }

  /**
   * 判断游戏是否激活状态
   * @returns {boolean} 如果游戏进行中返回true
   */
  isGameActive() {
    const { state } = this.context
    return !state.gameFinished
  }

  /**
   * 判断是否为玩家回合
   * @returns {boolean} 如果是玩家回合返回true
   */
  isPlayerTurn() {
    const { state } = this.context
    return state.activePlayer === 'human'
  }

  /**
   * 处理玩家攻击
   * @param {number} row 行索引
   * @param {number} col 列索引
   */
  handleAttack = (row, col) => {
    const { dispatch } = this.context

    if (this.isPlayerTurn() && this.isGameActive()) {
      dispatch({ type: 'HUMAN_ATTACK', payload: { row, col } })
    }
  }

  /**
   * 重置游戏
   */
  resetGame = () => {
    const { dispatch, resetElapsedTime } = this.context

    dispatch({ type: 'RESET_GAME' })
    resetElapsedTime()
  }

  /**
   * 构建游戏状态对象
   * @returns {Object} 游戏状态信息
   */
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

  /**
   * 渲染页面头部
   * @param {Object} gameStatus 游戏状态
   * @returns {JSX.Element} 头部JSX
   */
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

  /**
   * 渲染游戏结束通知
   * @param {Object} gameStatus 游戏状态
   * @returns {JSX.Element|null} 游戏结束通知JSX或null
   */
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

  /**
   * 渲染游戏区域
   * @returns {JSX.Element} 游戏区域JSX
   */
  renderGameZones() {
    const { state } = this.context
    const isTrainingMode = this.isTrainingMode()

    return (
      <div className="combat-zones">
        {/* 敌方区域 */}
        <div className="enemy-zone">
          <h3>Enemy Board</h3>
          <Board
            isCommanderBoard={false}
            onCellClick={this.handleAttack}
            disabled={!this.isPlayerTurn() || state.gameFinished}
          />
        </div>

        {/* 玩家区域 (仅在标准模式下显示) */}
        {!isTrainingMode && (
          <div className="commander-zone">
            <h3>Player Board</h3>
            <Board isCommanderBoard={true} disabled={true} />
          </div>
        )}
      </div>
    )
  }

  /**
   * 渲染游戏结束弹窗
   * @param {Object} gameStatus 游戏状态
   * @returns {JSX.Element|null} 游戏结束弹窗JSX或null
   */
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

  /**
   * 渲染舰队状态
   * @param {Object} gameStatus 游戏状态
   * @returns {JSX.Element} 舰队状态JSX
   */
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
        {/* 页面头部 */}
        {this.renderHeader(gameStatus)}

        {/* 游戏结束通知 */}
        {this.renderGameCompleteNotice(gameStatus)}

        {/* 游戏区域 */}
        {this.renderGameZones()}

        {/* 游戏结束弹窗 */}
        {this.renderGameCompleteModal(gameStatus)}

        {/* 舰队状态 */}
        {this.renderFleetStatus(gameStatus)}
      </div>
    )
  }
}

/**
 * 包装组件 - 连接上下文
 */
const BattleScreenWithContext = props => {
  const universeContext = useUniverseContext()

  return (
    <BattleContext.Provider value={universeContext}>
      <BattleScreen {...props} />
    </BattleContext.Provider>
  )
}

export default BattleScreenWithContext
