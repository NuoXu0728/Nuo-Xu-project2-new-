import React, { useMemo } from 'react'
import '../index.css'

const LeaderboardPage = () => {
  
  const leaderboardData = useMemo(
    () => [
      { rank: 1, name: 'Player1', score: 2500, date: '2157-03-15' },
      { rank: 2, name: 'Player2', score: 2200, date: '2157-03-14' },
      { rank: 3, name: 'Player3', score: 2100, date: '2157-03-13' }
    ],
    []
  )

  
  const tableHeaders = useMemo(
    () => [
      { id: 'rank', label: 'Rank' },
      { id: 'name', label: 'Player' },
      { id: 'score', label: 'Score' },
      { id: 'date', label: 'Date' }
    ],
    []
  )

  
  const renderTableHeader = useMemo(
    () => (
      <div className="table-header">
        {tableHeaders.map(header => (
          <span key={header.id}>{header.label}</span>
        ))}
      </div>
    ),
    [tableHeaders]
  )

  
  const renderRankingRows = useMemo(
    () =>
      leaderboardData.map(entry => (
        <div className="ranking-row" key={entry.rank}>
          <span className="rank-value">{entry.rank}</span>
          <span className="commander-name">{entry.name}</span>
          <span className="score-value">{entry.score}</span>
          <span className="score-date">{entry.date}</span>
        </div>
      )),
    [leaderboardData]
  )

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>

      <div className="leaderboard-table">
        {renderTableHeader}
        {renderRankingRows}
      </div>
    </div>
  )
}

export default LeaderboardPage
