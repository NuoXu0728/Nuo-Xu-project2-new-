import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'


const gameRules = [

  {
    id: 'results',
    title: 'Attack Results',
    descriptions: [
      'Hit or Miss: The AI will never strike the same position more than once, and you cannot choose a cell that you’ve already attacked.'
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
          {vessel.name} ({vessel.length} cells)
        </li>
      ))}
    </ul>
  )

  return (
    <div className="handbook-container">
      <h1 className="handbook-title">Battleship Combat Guide</h1>

      <div className="handbook-content">
        <section className="handbook-section">
          <h2>Game</h2>
          <p>Conquer all enemy ships before your fleet is wiped out!</p>
        </section>

        <section className="handbook-section">
          <h2>Game Introduction</h2>
          <p>
          Battleship is a classic two-player strategy game. In this version, you’ll be pitted against a simple AI.
          </p>
          <p>At the start of the game, 5 ships are randomly placed on each board:</p>
          {renderVesselList()}
        </section>

        <section className="handbook-section">
          <h2>Game Rules</h2>
          <div className="protocol-steps">{gameRules.map(rule => renderRuleItem(rule))}</div>
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
