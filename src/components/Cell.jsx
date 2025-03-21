import React from 'react';

class Cell extends React.Component {
  getCellStyle() {
    const { cell, isCommanderBoard } = this.props;
    
    if (!cell.isExposed) {
      
      let style = {
        backgroundColor: '#162536',
        cursor: 'pointer'
      };
      
      
      if (isCommanderBoard && cell.hasVessel) {
        style.backgroundColor = '#3e546a';
      }
      
      return style;
    } else if (cell.wasStruck) {
      
      return {
        backgroundColor: '#b83441',
        cursor: 'not-allowed'
      };
    } else {
      
      return {
        backgroundColor: '#2a5b8c',
        cursor: 'not-allowed'
      };
    }
  }
  
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