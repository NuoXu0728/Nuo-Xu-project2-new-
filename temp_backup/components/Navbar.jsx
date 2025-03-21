import React from 'react'
import { NavLink } from 'react-router-dom'
import '../index.css'

/**
 * 导航链接配置
 */
const NAV_ITEMS = [
  { path: '/', label: 'Home', exact: true },
  { path: '/handbook', label: 'Guide', exact: false },
  { path: '/leaderboard', label: 'Leaderboard', exact: false }
]

/**
 * 导航栏组件 - 提供应用程序的导航菜单
 */
class Navbar extends React.Component {
  constructor(props) {
    super(props)

    // 初始化状态
    this.state = {
      isMenuOpen: false
    }

    // 绑定方法
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  /**
   * 切换菜单状态
   */
  toggleMenu() {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }))
  }

  /**
   * 渲染导航链接
   * @returns {Array<JSX.Element>} 导航链接元素数组
   */
  renderNavLinks() {
    return NAV_ITEMS.map(item => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        end={item.exact}
      >
        {item.label}
      </NavLink>
    ))
  }

  render() {
    const { isMenuOpen } = this.state

    return (
      <nav className="navbar">
        {/* 品牌标志 */}
        <div className="nav-brand">
          <NavLink to="/" className="nav-logo">
            🚢 Battleship
          </NavLink>
        </div>

        {/* 导航链接 */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>{this.renderNavLinks()}</div>

        {/* 汉堡菜单按钮 (移动端) */}
        <button className="mobile-menu-button" onClick={this.toggleMenu} aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    )
  }
}

export default Navbar
