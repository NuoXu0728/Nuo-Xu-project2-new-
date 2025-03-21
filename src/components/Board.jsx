import React from 'react'
import { useUniverseContext } from '../context/GameContext'
import Cell from './Cell'


const BoardContext = React.createContext();

class Board extends React.Component {
  static contextType = BoardContext;
  
  handleCellClick = (row, col) => {
    const { grid, disabled, onCellClick } = this.props;
    
    if (disabled || grid[row][col].isExposed) {
      return;
    }

    if (onCellClick) {
      onCellClick(row, col);
    }
  }
  
  renderCell(cell, row, col) {
    const { isCommanderBoard } = this.props;
    
    return (
      <Cell
        key={`${row}-${col}`}
        cell={cell}
        isCommanderBoard={isCommanderBoard}
        onClick={() => this.handleCellClick(row, col)}
      />
    );
  }
  
  render() {
    const { grid } = this.props;
    
    
    if (!grid || !grid.length) {
      return <div className="loading-grid">Initializing game board...</div>;
    }
    
    return (
      <div className="board-grid">
        {grid.map((gridRow, row) =>
          gridRow.map((cell, col) => this.renderCell(cell, row, col))
        )}
      </div>
    );
  }
}

const BoardWithContext = (props) => {
  const universeContext = useUniverseContext();
  const grid = props.isCommanderBoard ? universeContext.state.humanGrid : universeContext.state.computerGrid;
  
  return (
    <BoardContext.Provider value={universeContext}>
      <Board {...props} grid={grid} />
    </BoardContext.Provider>
  );
};

export default BoardWithContext;
