import React from 'react'
import { NavLink } from 'react-router-dom'
import '../index.css'

const NAV_ITEMS = [
  { path: '/', label: 'Home', exact: true },
  { path: '/handbook', label: 'Guide', exact: false },
  { path: '/leaderboard', label: 'Leaderboard', exact: false }
]

class Navbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu() {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }))
  }

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
        <div className="nav-brand">
          <NavLink to="/" className="nav-logo">
            � Battleship
          </NavLink>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>{this.renderNavLinks()}</div>

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
