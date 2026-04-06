import { useState } from 'react'
import { isMuted, setMuted, playClick, playTick, playGoal, playSuccess } from '../lib/sounds'

export function useSound() {
  const [muted, setMutedState] = useState(() => isMuted())

  function toggleMute() {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }

  return { muted, toggleMute, playClick, playTick, playGoal, playSuccess }
}
