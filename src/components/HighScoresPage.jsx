import { Link } from 'react-router-dom'
import '../index.css'

const LeaderboardPage = () => {
  const rankings = [
    { rank: 1, name: 'player1', score: 2500, date: '2157-03-15' },
    { rank: 2, name: 'player2', score: 2200, date: '2157-03-14' },
    { rank: 3, name: 'player3', score: 2100, date: '2157-03-13' },
    { rank: 4, name: 'player4', score: 2000, date: '2157-03-12' },
    { rank: 5, name: 'player5', score: 1900, date: '2157-03-11' }
  ]

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">🏆 Command Rankings</h1>

      <div className="leaderboard-table">
        <div className="table-header">
          <span>Rank</span>
          <span>Commander</span>
          <span>Score</span>
          <span>Date</span>
        </div>

        {rankings.map(entry => (
          <div className="ranking-row" key={entry.rank}>
            <span className="rank-value">
              {entry.rank === 1
                ? '🥇'
                : entry.rank === 2
                ? '🥈'
                : entry.rank === 3
                ? '🥉'
                : `#${entry.rank}`}
            </span>
            <span className="commander-name">{entry.name}</span>
            <span className="score-value">{entry.score}</span>
            <span className="score-date">{entry.date}</span>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <Link to="/" className="back-button">
          ← Return to Command
        </Link>
      </div>
    </div>
  )
}

export default LeaderboardPage
