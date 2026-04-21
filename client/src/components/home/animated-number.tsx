import { useEffect, useRef, useState } from 'react'

type AnimatedNumberProps = {
  value: string | number
  className?: string
}

export function AnimatedNumber({ value, className = '' }: AnimatedNumberProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const previousValueRef = useRef<string | number>(value)

  useEffect(() => {
    if (previousValueRef.current === value) return

    previousValueRef.current = value
    setIsBlinking(true)

    const timer = window.setTimeout(() => {
      setIsBlinking(false)
    }, 280)

    return () => {
      window.clearTimeout(timer)
    }
  }, [value])

  return (
    <span
      className={`${className} transition-all duration-200 ${
        isBlinking ? 'text-indigo-500 opacity-100' : 'opacity-90'
      }`}
    >
      {value}
    </span>
  )
}
