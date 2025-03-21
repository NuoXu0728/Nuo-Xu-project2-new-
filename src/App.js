import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UniverseProvider } from './context/GameContext'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import BattleScreen from './components/GamePage'
import GuidePage from './components/GuidePage'
import LeaderboardPage from './components/LeaderboardPage'
import React from 'react'

class App extends React.Component {
  render() {
    return (
      <UniverseProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/battle/standard" element={<BattleScreen mode="normal" />} />
              <Route path="/battle/training" element={<BattleScreen mode="training" />} />
              <Route path="/handbook" element={<GuidePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </Layout>
        </Router>
      </UniverseProvider>
    )
  }
}

export default App
