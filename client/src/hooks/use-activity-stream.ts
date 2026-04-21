import { useCallback, useEffect, useRef, useState } from 'react'
import type { HomeActivityItem } from '@shared/types'

const MAX_SEEN_ACTIVITY_IDS = 400

const NORMAL_ACTIVITY_DELAY_MS = 240
const FAST_ACTIVITY_DELAY_MS = 120
const FAST_ACTIVITY_THRESHOLD = 6

export function useActivityStream() {
  const [currentActivity, setCurrentActivity] = useState<HomeActivityItem | null>(null)

  const timerRef = useRef<number | null>(null)
  const queueRef = useRef<HomeActivityItem[]>([])

  const seenIdsRef = useRef<Set<string>>(new Set())
  const seenOrderRef = useRef<string[]>([])

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return

    window.clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const reset = useCallback(() => {
    clearTimer()

    setCurrentActivity(null)
    queueRef.current = []
    seenIdsRef.current.clear()
    seenOrderRef.current = []
  }, [clearTimer])

  const rememberActivity = useCallback((sequenceNumber: string) => {
    if (seenIdsRef.current.has(sequenceNumber)) return false

    seenIdsRef.current.add(sequenceNumber)
    seenOrderRef.current.push(sequenceNumber)

    if (seenOrderRef.current.length > MAX_SEEN_ACTIVITY_IDS) {
      const oldestId = seenOrderRef.current.shift()

      if (oldestId) {
        seenIdsRef.current.delete(oldestId)
      }
    }

    return true
  }, [])

  const playNext = useCallback(function playNextInternal() {
    if (timerRef.current !== null) return

    const nextActivity = queueRef.current.shift()
    if (!nextActivity) return

    setCurrentActivity(nextActivity)

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      playNextInternal()
    }, getActivityDelay(queueRef.current.length))
  }, [])

  const enqueue = useCallback(
    (items: HomeActivityItem[]) => {
      const newActivities = items
        .filter((item) => rememberActivity(item.sequenceNumber))
        .sort((a, b) => Number(a.sequenceNumber) - Number(b.sequenceNumber))

      if (newActivities.length === 0) return

      queueRef.current.push(...newActivities)
      playNext()
    },
    [playNext, rememberActivity],
  )

  useEffect(() => {
    return reset
  }, [reset])

  return {
    currentActivity,
    enqueue,
    reset,
  }
}

function getActivityDelay(queueLength: number) {
  return queueLength >= FAST_ACTIVITY_THRESHOLD ? FAST_ACTIVITY_DELAY_MS : NORMAL_ACTIVITY_DELAY_MS
}
