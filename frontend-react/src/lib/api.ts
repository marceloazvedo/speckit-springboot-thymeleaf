import type { Account, PullResult, PushPayload, PushResult } from './types'

const BASE = '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new ApiError(response.status, body || response.statusText)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function register(email: string, password: string): Promise<Account> {
  return request<Account>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function login(email: string, password: string): Promise<Account> {
  return request<Account>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function logout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST' })
}

export function me(): Promise<Account> {
  return request<Account>('/auth/me')
}

export function push(cursor: number, payload: PushPayload): Promise<PushResult> {
  return request<PushResult>('/sync/push', {
    method: 'POST',
    body: JSON.stringify({ cursor, ...payload }),
  })
}

export function pull(cursor: number): Promise<PullResult> {
  return request<PullResult>(`/sync/pull?cursor=${cursor}`)
}
