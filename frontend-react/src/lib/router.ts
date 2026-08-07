import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  window.addEventListener('popstate', emit)
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0) window.removeEventListener('popstate', emit)
  }
}

function snapshot(): string {
  return window.location.pathname
}

export function navigate(path: string): void {
  if (window.location.pathname === path) return
  window.history.pushState(null, '', path)
  emit()
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, snapshot, () => '/')
}

export function isDemoPath(pathname: string): boolean {
  return pathname === '/demo' || pathname.startsWith('/demo/')
}
