/**
 * 日志服务 — 统一日志管理
 *
 * 支持分级输出：debug / info / warn / error
 * 开发环境默认输出到 console，后续可扩展接入 Sentry 等远程平台。
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  extra?: Record<string, unknown>
}

type LogHandler = (entry: LogEntry) => void

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private handlers: LogHandler[] = []
  private minLevel: LogLevel = 'debug'

  constructor() {
    // 默认输出到 console
    this.addHandler((entry) => {
      const { level, message, timestamp, extra } = entry
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`
      const extraStr = extra ? ` ${JSON.stringify(extra)}` : ''

      switch (level) {
        case 'debug':
          console.debug(`${prefix} ${message}${extraStr}`)
          break
        case 'info':
          console.info(`${prefix} ${message}${extraStr}`)
          break
        case 'warn':
          console.warn(`${prefix} ${message}${extraStr}`)
          break
        case 'error':
          console.error(`${prefix} ${message}${extraStr}`)
          break
      }
    })
  }

  /**
   * 添加自定义日志处理器（例如远程上报）
   */
  addHandler(handler: LogHandler): void {
    this.handlers.push(handler)
  }

  /**
   * 设置最低输出级别，低于该级别的日志将被忽略
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[this.minLevel]) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      extra,
    }

    this.handlers.forEach((handler) => {
      try {
        handler(entry)
      } catch {
        // 日志处理器自身出错不应影响业务
      }
    })
  }

  debug(message: string, extra?: Record<string, unknown>): void {
    this.log('debug', message, extra)
  }

  info(message: string, extra?: Record<string, unknown>): void {
    this.log('info', message, extra)
  }

  warn(message: string, extra?: Record<string, unknown>): void {
    this.log('warn', message, extra)
  }

  error(message: string, extra?: Record<string, unknown>): void {
    this.log('error', message, extra)
  }
}

/** 全局单例 */
export const logger = new Logger()

export { Logger }
export type { LogLevel, LogEntry, LogHandler }
