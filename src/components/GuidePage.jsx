import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'


const gameRules = [
  {
    id: 'turn',
    title: '1. Turn-Based',
    description: 'You and the AI take turns (the player always goes first)'
  },
  {
    id: 'attack',
    title: '2. Attack Method',
    descriptions: [
      "On your turn, select a square on your opponent's grid to attack",
      "On the AI's turn, it will randomly select a square on your grid"
    ]
  },
  {
    id: 'results',
    title: '3. Attack Results',
    descriptions: [
      'Hit: 💥 | Miss: 🌊',
      "The AI won't attack the same position twice, and you cannot select positions you've already attacked"
    ]
  }
]


const vessels = [
  { name: 'Battleship', length: 5 },
  { name: 'Cruiser', length: 4 },
  { name: 'Destroyer', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Patrol Boat', length: 2 }
]

const GuidePage = () => {
  
  const renderRuleItem = rule => (
    <div className="step" key={rule.id}>
      <h3>{rule.title}</h3>
      {rule.description && <p>{rule.description}</p>}
      {rule.descriptions &&
        rule.descriptions.map((desc, idx) => <p key={`${rule.id}-desc-${idx}`}>{desc}</p>)}
    </div>
  )

  
  const renderVesselList = () => (
    <ul className="vessel-list">
      {vessels.map((vessel, index) => (
        <li key={`vessel-${index}`}>
          1 {vessel.name} ({vessel.length} cells long)
        </li>
      ))}
    </ul>
  )

  return (
    <div className="handbook-container">
      <h1 className="handbook-title">Battleship Combat Guide</h1>

      <div className="handbook-content">
        <section className="handbook-section">
          <h2>🎯 Game Objective</h2>
          <p>Destroy all enemy ships before they eliminate your fleet!</p>
        </section>

        <section className="handbook-section">
          <h2>🚢 Game Introduction</h2>
          <p>
            Battleship is a two-player board game. In this project, you will battle against a simple
            AI opponent.
          </p>
          <p>
            The game consists of two 10×10 boards, one representing your battlefield, and one
            representing the enemy's.
          </p>
          <p>At the start of the game, 5 ships are randomly placed on each board:</p>
          {renderVesselList()}
          <p>Each ship fits entirely on the board and does not overlap with any other ship.</p>
        </section>

        <section className="handbook-section">
          <h2>🎮 Game Rules</h2>
          <div className="protocol-steps">{gameRules.map(rule => renderRuleItem(rule))}</div>
        </section>

        <section className="handbook-section">
          <h2>🏆 Victory Condition</h2>
          <p>The first player to destroy all of the opponent's ships wins!</p>
        </section>
      </div>

      <div className="navigation-buttons">
        <Link to="/" className="back-button">
          ← Return to Command Center
        </Link>
      </div>
    </div>
  )
}

export default GuidePage
