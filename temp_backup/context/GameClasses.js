/**
 * 游戏类库 - 面向对象的游戏实现
 */

/**
 * 单元格类 - 表示棋盘上的一个格子
 */
export class Cell {
  constructor() {
    this.hasVessel = false
    this.wasStruck = false
    this.isExposed = false
  }

  /**
   * 创建单元格的副本
   */
  clone() {
    const cell = new Cell()
    cell.hasVessel = this.hasVessel
    cell.wasStruck = this.wasStruck
    cell.isExposed = this.isExposed
    return cell
  }

  /**
   * 在此单元格放置战舰
   */
  placeVessel() {
    this.hasVessel = true
    return this
  }

  /**
   * 攻击此单元格
   */
  attack() {
    this.isExposed = true
    if (this.hasVessel) {
      this.wasStruck = true
    }
    return this
  }
}

/**
 * 战舰类型
 */
export class VesselType {
  constructor(id, length, name) {
    this.id = id
    this.length = length
    this.name = name
  }
}

/**
 * 战舰类 - 表示一艘已部署的战舰
 */
export class Vessel {
  constructor(type) {
    this.type = type
    this.deployed = false
    this.position = null // {row, col, vertical}
  }

  /**
   * 部署战舰
   */
  deploy(row, col, vertical) {
    this.deployed = true
    this.position = { row, col, vertical }
    return this
  }

  /**
   * 获取战舰占据的所有格子
   */
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

/**
 * 棋盘类 - 表示10x10的游戏棋盘
 */
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

  /**
   * 获取指定位置的单元格
   */
  getCell(row, col) {
    return this.cells[row][col]
  }

  /**
   * 设置指定位置的单元格
   */
  setCell(row, col, cell) {
    this.cells[row][col] = cell
    return this
  }

  /**
   * 克隆棋盘
   */
  clone() {
    const grid = new Grid()
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        grid.cells[i][j] = this.cells[i][j].clone()
      }
    }
    return grid
  }

  /**
   * 检查是否可以放置战舰
   */
  canPlaceVessel(row, col, length, vertical) {
    // 检查边界
    for (let i = 0; i < length; i++) {
      const checkRow = vertical ? row + i : row
      const checkCol = vertical ? col : col + i

      // 超出边界检查
      if (checkRow >= 10 || checkCol >= 10) {
        return false
      }

      // 已有战舰检查
      if (this.cells[checkRow][checkCol].hasVessel) {
        return false
      }

      // 相邻位置检查
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

  /**
   * 放置战舰
   */
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

  /**
   * 随机部署战舰
   */
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

  /**
   * 攻击指定位置
   */
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

  /**
   * 检查是否所有战舰都被击沉
   */
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

  /**
   * 计算电脑的攻击目标
   */
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

  /**
   * 转换为普通对象（用于存储）
   */
  toObject() {
    return this.cells.map(row =>
      row.map(cell => ({
        hasVessel: cell.hasVessel,
        wasStruck: cell.wasStruck,
        isExposed: cell.isExposed
      }))
    )
  }

  /**
   * 从对象创建网格（用于加载存储的数据）
   */
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

/**
 * 游戏类 - 表示一场游戏
 */
export class Game {
  constructor() {
    // 定义战舰类型
    this.vesselTypes = [
      new VesselType('capital', 5, 'Capital Ship'),
      new VesselType('cruiser', 4, 'Cruiser'),
      new VesselType('destroyer', 3, 'Destroyer'),
      new VesselType('scout', 3, 'Scout'),
      new VesselType('drone', 2, 'Drone')
    ]

    // 初始化游戏状态
    this.humanGrid = new Grid()
    this.computerGrid = new Grid()
    this.gameType = null
    this.gameFinished = false
    this.victor = null
    this.activePlayer = 'human'
  }

  /**
   * 开始新游戏
   */
  start(gameType) {
    this.gameType = gameType
    this.gameFinished = false
    this.victor = null
    this.activePlayer = 'human'

    // 随机部署战舰
    this.humanGrid = new Grid().deployVesselsRandomly(this.vesselTypes)
    this.computerGrid = new Grid().deployVesselsRandomly(this.vesselTypes)

    return this
  }

  /**
   * 人类玩家攻击
   */
  humanAttack(row, col) {
    // 检查是否可以攻击
    if (this.gameFinished || this.activePlayer !== 'human') {
      return false
    }

    // 检查单元格是否已暴露
    if (this.computerGrid.cells[row][col].isExposed) {
      return false
    }

    // 执行攻击
    this.computerGrid.attack(row, col)

    // 检查是否获胜
    if (this.computerGrid.areAllVesselsDestroyed()) {
      this.gameFinished = true
      this.victor = 'Commander'
      return true
    }

    // 切换玩家
    this.activePlayer = this.gameType === 'training' ? 'human' : 'computer'
    return true
  }

  /**
   * 电脑攻击
   */
  computerAttack() {
    // 检查是否可以攻击
    if (this.gameFinished || this.activePlayer !== 'computer' || this.gameType === 'training') {
      return false
    }

    // 计算攻击目标
    const target = this.humanGrid.calculateAttackTarget()
    if (!target) {
      return false
    }

    // 执行攻击
    this.humanGrid.attack(target.row, target.col)

    // 检查是否获胜
    if (this.humanGrid.areAllVesselsDestroyed()) {
      this.gameFinished = true
      this.victor = 'Enemy Fleet'
      return true
    }

    // 切换玩家
    this.activePlayer = 'human'
    return true
  }

  /**
   * 重置游戏
   */
  reset() {
    const gameType = this.gameType
    return this.start(gameType)
  }

  /**
   * 转换为普通对象（用于存储）
   */
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

  /**
   * 从对象创建游戏（用于加载存储的数据）
   */
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
