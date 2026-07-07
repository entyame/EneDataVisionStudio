/**
 * HTTP 客户端 — 基于 Axios 封装
 *
 * 统一拦截请求/响应，集成日志和错误处理。
 */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { logger } from '@/logs/logger'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DATA_SOURCE === 'mock' ? '' : import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    logger.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
    })
    return config
  },
  (error) => {
    logger.error('[HTTP] Request error', { error: error.message })
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug(`[HTTP] Response ${response.status} from ${response.config.url}`)
    return response
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network Error'
    logger.error(`[HTTP] Response error: ${message}`, {
      status: error.response?.status,
      url: error.config?.url,
    })
    return Promise.reject(error)
  },
)

export default http
