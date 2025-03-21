
export class Cell {
  constructor() {
    this.hasVessel = false
    this.wasStruck = false
    this.isExposed = false
  }

  clone() {
    const cell = new Cell()
    cell.hasVessel = this.hasVessel
    cell.wasStruck = this.wasStruck
    cell.isExposed = this.isExposed
    return cell
  }

  placeVessel() {
    this.hasVessel = true
    return this
  }

  attack() {
    this.isExposed = true
    if (this.hasVessel) {
      this.wasStruck = true
    }
    return this
  }
}

export class VesselType {
  constructor(id, length, name) {
    this.id = id
    this.length = length
    this.name = name
  }
}

export class Vessel {
  constructor(type) {
    this.type = type
    this.deployed = false
    this.position = null 
  }

  deploy(row, col, vertical) {
    this.deployed = true
    this.position = { row, col, vertical }
    return this
  }

  getOccupiedCells() {
    if (!this.deployed) return []

    const cells = []
    const { row, col, vertical } = this.position

    for (let i = 0; i < this.type.length; i++) {
      if (vertical) {
        cells.push({ row: row + i, col })
      } else {
        cells.push({ row, col: col + i })
      }
    }

    return cells
  }
}

export class Grid {
  constructor() {
    this.cells = []
    for (let i = 0; i < 10; i++) {
      const row = []
      for (let j = 0; j < 10; j++) {
        row.push(new Cell())
      }
      this.cells.push(row)
    }
  }

  getCell(row, col) {
    return this.cells[row][col]
  }

  setCell(row, col, cell) {
    this.cells[row][col] = cell
    return this
  }

  clone() {
    const grid = new Grid()
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        grid.cells[i][j] = this.cells[i][j].clone()
      }
    }
    return grid
  }

  canPlaceVessel(row, col, length, vertical) {
    
    for (let i = 0; i < length; i++) {
      const checkRow = vertical ? row + i : row
      const checkCol = vertical ? col : col + i

      
      if (checkRow >= 10 || checkCol >= 10) {
        return false
      }

      
      if (this.cells[checkRow][checkCol].hasVessel) {
        return false
      }

      
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const adjacentRow = checkRow + dr
          const adjacentCol = checkCol + dc

          if (adjacentRow >= 0 && adjacentRow < 10 && adjacentCol >= 0 && adjacentCol < 10) {
            if (this.cells[adjacentRow][adjacentCol].hasVessel) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  placeVessel(row, col, length, vertical) {
    if (!this.canPlaceVessel(row, col, length, vertical)) {
      return false
    }

    for (let i = 0; i < length; i++) {
      const vesselRow = vertical ? row + i : row
      const vesselCol = vertical ? col : col + i
      this.cells[vesselRow][vesselCol].placeVessel()
    }

    return true
  }

  deployVesselsRandomly(vesselTypes) {
    for (const type of vesselTypes) {
      let deployed = false
      while (!deployed) {
        const vertical = Math.random() > 0.5
        const maxRow = vertical ? 10 - type.length : 9
        const maxCol = vertical ? 9 : 10 - type.length
        const row = Math.floor(Math.random() * (maxRow + 1))
        const col = Math.floor(Math.random() * (maxCol + 1))

        deployed = this.placeVessel(row, col, type.length, vertical)
      }
    }

    return this
  }

  attack(row, col) {
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      return false
    }

    if (this.cells[row][col].isExposed) {
      return false
    }

    this.cells[row][col].attack()
    return true
  }

  areAllVesselsDestroyed() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = this.cells[i][j]
        if (cell.hasVessel && !cell.wasStruck) {
          return false
        }
      }
    }
    return true
  }

  calculateAttackTarget() {
    const availableTargets = []

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!this.cells[i][j].isExposed) {
          availableTargets.push({ row: i, col: j })
        }
      }
    }

    if (availableTargets.length === 0) {
      return null
    }

    return availableTargets[Math.floor(Math.random() * availableTargets.length)]
  }

  toObject() {
    return this.cells.map(row =>
      row.map(cell => ({
        hasVessel: cell.hasVessel,
        wasStruck: cell.wasStruck,
        isExposed: cell.isExposed
      }))
    )
  }

  static fromObject(obj) {
    if (!obj || !Array.isArray(obj) || obj.length !== 10) {
      return new Grid()
    }

    const grid = new Grid()

    for (let i = 0; i < 10; i++) {
      if (!Array.isArray(obj[i]) || obj[i].length !== 10) {
        continue
      }

      for (let j = 0; j < 10; j++) {
        const cellData = obj[i][j]
        const cell = new Cell()

        cell.hasVessel = cellData.hasVessel || false
        cell.wasStruck = cellData.wasStruck || false
        cell.isExposed = cellData.isExposed || false

        grid.cells[i][j] = cell
      }
    }

    return grid
  }
}

export class Game {
  constructor() {
    
    this.vesselTypes = [
      new VesselType('capital', 5, 'Capital Ship'),
      new VesselType('cruiser', 4, 'Cruiser'),
      new VesselType('destroyer', 3, 'Destroyer'),
      new VesselType('scout', 3, 'Scout'),
      new VesselType('drone', 2, 'Drone')
    ]

    
    this.humanGrid = new Grid()
    this.computerGrid = new Grid()
    this.gameType = null
    this.gameFinished = false
    this.victor = null
    this.activePlayer = 'human'
  }

  start(gameType) {
    this.gameType = gameType
    this.gameFinished = false
    this.victor = null
    this.activePlayer = 'human'

    
    this.humanGrid = new Grid().deployVesselsRandomly(this.vesselTypes)
    this.computerGrid = new Grid().deployVesselsRandomly(this.vesselTypes)

    return this
  }

  humanAttack(row, col) {
    
    if (this.gameFinished || this.activePlayer !== 'human') {
      return false
    }

    
    if (this.computerGrid.cells[row][col].isExposed) {
      return false
    }

    
    this.computerGrid.attack(row, col)

    
    if (this.computerGrid.areAllVesselsDestroyed()) {
      this.gameFinished = true
      this.victor = 'Commander'
      return true
    }

    
    this.activePlayer = this.gameType === 'training' ? 'human' : 'computer'
    return true
  }

  computerAttack() {
    
    if (this.gameFinished || this.activePlayer !== 'computer' || this.gameType === 'training') {
      return false
    }

    
    const target = this.humanGrid.calculateAttackTarget()
    if (!target) {
      return false
    }

    
    this.humanGrid.attack(target.row, target.col)

    
    if (this.humanGrid.areAllVesselsDestroyed()) {
      this.gameFinished = true
      this.victor = 'Enemy Fleet'
      return true
    }

    
    this.activePlayer = 'human'
    return true
  }

  reset() {
    const gameType = this.gameType
    return this.start(gameType)
  }

  toObject() {
    return {
      humanGrid: this.humanGrid.toObject(),
      computerGrid: this.computerGrid.toObject(),
      gameType: this.gameType,
      gameFinished: this.gameFinished,
      victor: this.victor,
      activePlayer: this.activePlayer
    }
  }

  static fromObject(obj) {
    if (!obj) {
      return new Game()
    }

    const game = new Game()

    game.humanGrid = Grid.fromObject(obj.humanGrid)
    game.computerGrid = Grid.fromObject(obj.computerGrid)
    game.gameType = obj.gameType
    game.gameFinished = obj.gameFinished || false
    game.victor = obj.victor
    game.activePlayer = obj.activePlayer || 'human'

    return game
  }
}
