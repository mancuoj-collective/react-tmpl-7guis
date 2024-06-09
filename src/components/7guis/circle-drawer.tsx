import { type MouseEvent, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'

type Circle = {
  cx: number
  cy: number
  r: number
}

export function CircleDrawer() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [circles, setCircles] = useState<Circle[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [adjusting, setAdjusting] = useState(false)
  const [history, setHistory] = useState<Circle[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [debouncedTimer, setDebouncedTimer] = useState<NodeJS.Timeout | null>(null)

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (adjusting) {
      setAdjusting(false)
      setSelectedIndex(null)
      return
    }

    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const selectedCircleIndex = circles.findLastIndex(({ cx, cy, r }) => {
      const dx = cx - x
      const dy = cy - y
      return dx * dx + dy * dy <= r * r
    })

    if (selectedCircleIndex !== -1) {
      setSelectedIndex(selectedCircleIndex)
    } else {
      const newCircles = [...circles, { cx: x, cy: y, r: 25 }]
      setCircles(newCircles)
      pushHistory(newCircles)
    }
  }

  const adjust = (index: number) => {
    setSelectedIndex(index)
    setAdjusting(true)
  }

  const handleAdjustRadius = (e: number[]) => {
    if (selectedIndex === null) return
    const newCircles = circles.map((circle, index) => (index === selectedIndex ? { ...circle, r: e[0] } : circle))
    setCircles(newCircles)

    if (debouncedTimer) {
      clearTimeout(debouncedTimer)
    }
    const timer = setTimeout(() => {
      pushHistory(newCircles)
    }, 300)
    setDebouncedTimer(timer)
  }

  const pushHistory = (newCircles: Circle[] = circles) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newCircles]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCircles(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCircles(history[historyIndex + 1])
    }
  }

  return (
    <div className="relative h-64 w-96 rounded-md border">
      <svg ref={svgRef} width="100%" height="100%" onClick={handleClick}>
        {circles.map((circle, i) => (
          <circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            className={cn('fill-foreground/50 stroke-background stroke-2', {
              'fill-foreground': selectedIndex === i,
            })}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex(i)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              adjust(i)
            }}
          />
        ))}
      </svg>

      {adjusting && selectedIndex !== null && (
        <div
          className="absolute inset-0 m-auto grid h-20 w-64 rounded-md border bg-background/95 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <p>Adjust the radius {circles[selectedIndex].r}</p>
          <Slider min={10} max={100} value={[circles[selectedIndex].r]} onValueChange={handleAdjustRadius} />
        </div>
      )}

      <div className="absolute right-1 top-1">
        <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0 || adjusting}>
          <span className="i-lucide-undo" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1 || adjusting}>
          <span className="i-lucide-redo" />
        </Button>
      </div>
    </div>
  )
}
