import { Link } from 'react-router-dom'
import '../index.css'

const GuidePage = () => {
  return (
    <div className="handbook-container">
      <h1 className="handbook-title">Battlefield Operations Manual</h1>

      <div className="handbook-content">
        <section className="handbook-section">
          <h2>🎯 Mission Objective</h2>
          <p>Destroy all enemy vessels before they eliminate your fleet!</p>
        </section>

        <section className="handbook-section">
          <h2>🚢 Fleet Configuration</h2>
          <ul className="vessel-list">
            <li>1x Capital Ship (5 units)</li>
            <li>1x Cruiser (4 units)</li>
            <li>1x Destroyer (3 units)</li>
            <li>1x Scout Ship (3 units)</li>
            <li>1x Drone (2 units)</li>
          </ul>
        </section>

        <section className="handbook-section">
          <h2>🎮 Battle Protocol</h2>
          <div className="protocol-steps">
            <div className="step">
              <h3>1. Deployment Phase</h3>
              <p>Vessels are randomly positioned in both territories</p>
            </div>
            <div className="step">
              <h3>2. Combat Phase</h3>
              <p>Take turns targeting enemy grid coordinates</p>
            </div>
            <div className="step">
              <h3>3. Targeting Feedback</h3>
              <p>💥 = Direct Hit | 🌊 = Miss</p>
            </div>
          </div>
        </section>

        <section className="handbook-section">
          <h2>🏆 Victory Conditions</h2>
          <p>The first commander to eliminate all enemy vessels wins!</p>
        </section>
      </div>

      <div className="navigation-buttons">
        <Link to="/" className="back-button">
          ← Return to Command
        </Link>
      </div>
    </div>
  )
}

export default GuidePage
