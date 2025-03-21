import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

// 游戏模式配置数据
const gameModes = [
  {
    id: 'standard',
    path: '/battle/standard',
    className: 'mode-button standard-mode',
    label: 'Standard Battle'
  },
  {
    id: 'training',
    path: '/battle/training',
    className: 'mode-button training-mode',
    label: 'Training Mode'
  }
]

// 快速链接配置数据
const quickLinks = [
  { id: 'guide', path: '/handbook', label: 'Game Guide' },
  { id: 'leaderboard', path: '/leaderboard', label: 'Leaderboard' }
]

const HomePage = () => {
  // 使用useMemo缓存游戏模式按钮组件
  const modeButtons = useMemo(() => {
    return gameModes.map(mode => (
      <Link key={mode.id} to={mode.path} className={mode.className}>
        {mode.label}
      </Link>
    ))
  }, [])

  // 使用useMemo缓存快速链接组件
  const quickLinkButtons = useMemo(() => {
    return quickLinks.map(link => (
      <Link key={link.id} to={link.path} className="link-button">
        {link.label}
      </Link>
    ))
  }, [])

  return (
    <div className="home-container">
      <h1 className="game-title">⚔️ Battleship ⚔️</h1>

      <div className="mode-selection">
        <h2>Select Game Mode</h2>
        <div className="mode-buttons">{modeButtons}</div>
      </div>

      <div className="quick-links">{quickLinkButtons}</div>
    </div>
  )
}

export default HomePage
