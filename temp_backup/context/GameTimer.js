/**
 * 游戏计时器类 - 负责管理游戏内的时间流逝
 */
export class GameTimer {
  constructor() {
    this.elapsedTime = 0
    this.isActive = false
    this.intervalId = null
    this.onTickCallback = null
  }

  /**
   * 启动计时器
   * @param {Function} onTick 每秒触发的回调函数
   */
  start(onTick) {
    if (this.isActive) {
      return
    }

    this.isActive = true
    this.onTickCallback = onTick

    this.intervalId = setInterval(() => {
      this.elapsedTime += 1

      if (this.onTickCallback) {
        this.onTickCallback(this.elapsedTime)
      }
    }, 1000)
  }

  /**
   * 暂停计时器
   */
  pause() {
    if (!this.isActive || this.intervalId === null) {
      return
    }

    clearInterval(this.intervalId)
    this.intervalId = null
    this.isActive = false
  }

  /**
   * 继续计时
   */
  resume() {
    if (this.isActive) {
      return
    }

    this.start(this.onTickCallback)
  }

  /**
   * 停止计时器
   */
  stop() {
    this.pause()
    this.elapsedTime = 0
  }

  /**
   * 重置计时器
   */
  reset() {
    const wasActive = this.isActive

    this.pause()
    this.elapsedTime = 0

    if (wasActive) {
      this.resume()
    }
  }

  /**
   * 获取当前经过的时间（秒）
   */
  getElapsedTime() {
    return this.elapsedTime
  }

  /**
   * 获取格式化的时间字符串 (MM:SS)
   */
  getFormattedTime() {
    const minutes = Math.floor(this.elapsedTime / 60)
    const seconds = this.elapsedTime % 60

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}
