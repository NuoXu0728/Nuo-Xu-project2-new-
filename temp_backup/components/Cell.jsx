import React from 'react';

/**
 * 单元格组件 - 显示游戏棋盘上的一个格子
 */
class Cell extends React.Component {
  /**
   * 获取单元格样式
   * @returns {Object} 单元格样式对象
   */
  getCellStyle() {
    const { cell, isCommanderBoard } = this.props;
    
    if (!cell.isExposed) {
      // 未被攻击的单元格
      let style = {
        backgroundColor: '#162536',
        cursor: 'pointer'
      };
      
      // 在指挥官棋盘上显示自己的战舰
      if (isCommanderBoard && cell.hasVessel) {
        style.backgroundColor = '#3e546a';
      }
      
      return style;
    } else if (cell.wasStruck) {
      // 命中战舰的单元格
      return {
        backgroundColor: '#b83441',
        cursor: 'not-allowed'
      };
    } else {
      // 未命中的单元格
      return {
        backgroundColor: '#2a5b8c',
        cursor: 'not-allowed'
      };
    }
  }
  
  /**
   * 获取单元格内容
   * @returns {string} 单元格显示的内容
   */
  getCellContent() {
    const { cell } = this.props;
    
    if (!cell.isExposed) {
      return '';
    } else if (cell.wasStruck) {
      return '💥';
    } else {
      return '🌊';
    }
  }
  
  /**
   * 处理单元格点击事件
   */
  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }
  
  render() {
    return (
      <div 
        className="grid-cell"
        onClick={this.handleClick}
        style={this.getCellStyle()}
      >
        {this.getCellContent()}
      </div>
    );
  }
}

export default Cell;