import React from 'react'
import { useUniverseContext } from '../context/GameContext'
import Cell from './Cell'

// 创建Board组件使用的上下文
const BoardContext = React.createContext();

/**
 * 棋盘组件 - 显示游戏棋盘
 */
class Board extends React.Component {
  /**
   * 使用上下文类型
   */
  static contextType = BoardContext;
  
  /**
   * 处理单元格点击
   * @param {number} row 行索引
   * @param {number} col 列索引
   */
  handleCellClick = (row, col) => {
    const { grid, disabled, onCellClick } = this.props;
    
    if (disabled || grid[row][col].isExposed) {
      return;
    }

    if (onCellClick) {
      onCellClick(row, col);
    }
  }
  
  /**
   * 渲染单个单元格
   * @param {Object} cell 单元格数据
   * @param {number} row 行索引
   * @param {number} col 列索引
   * @returns {JSX.Element} 单元格组件
   */
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
    
    // 防止在网格尚未准备好时渲染
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

/**
 * 包装器组件 - 连接上下文以获取数据
 */
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
