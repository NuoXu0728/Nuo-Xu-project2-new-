export class GameTimer {
  constructor() {
    this.elapsedTime = 0
    this.isActive = false
    this.intervalId = null
    this.onTickCallback = null
  }

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

  pause() {
    if (!this.isActive || this.intervalId === null) {
      return
    }

    clearInterval(this.intervalId)
    this.intervalId = null
    this.isActive = false
  }

  resume() {
    if (this.isActive) {
      return
    }

    this.start(this.onTickCallback)
  }

  stop() {
    this.pause()
    this.elapsedTime = 0
  }

  reset() {
    const wasActive = this.isActive

    this.pause()
    this.elapsedTime = 0

    if (wasActive) {
      this.resume()
    }
  }

  getElapsedTime() {
    return this.elapsedTime
  }

  getFormattedTime() {
    const minutes = Math.floor(this.elapsedTime / 60)
    const seconds = this.elapsedTime % 60

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}
