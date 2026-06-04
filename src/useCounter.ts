import { useState, useEffect } from 'react'
import { app } from './app'

export interface UseCounterResult {
  count: number
  kvLoading: boolean
  increment: () => void
}

export function useCounter(
  user: { id: string; login: string; avatarUrl: string | null; dateOfBirth: string | null } | null
): UseCounterResult {
  const [count, setCount] = useState<number>(0)
  const [kvLoading, setKvLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user === null) {
      setCount(0)
      setKvLoading(false)
      return
    }

    // user is non-null: hydrate from KV
    setKvLoading(true)
    app.kv
      .get<number>('count')
      .then((val) => {
        setCount(val ?? 0)
        setKvLoading(false)
      })
      .catch(() => {
        setCount(0)
        setKvLoading(false)
      })
  }, [user])

  function increment() {
    if (user === null) return // guard: never call kv when unauthenticated
    const next = count + 1
    setCount(next) // optimistic update
    app.kv.set('count', next) // fire-and-forget
  }

  return { count, kvLoading, increment }
}
