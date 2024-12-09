import { Wrapper } from './wrapper'
import { type MouseEvent, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { useDebounceCallback } from 'usehooks-ts'

/**
 * The task is to build a frame containing an undo and redo button as well as a canvas area underneath.
 *
 * 1. Left-clicking inside an empty area inside the canvas will create an unfilled circle
 *    with a fixed diameter whose center is the left-clicked point.
 * 2. The circle nearest to the mouse pointer such that the distance from its center
 *    to the pointer is less than its radius, if it exists, is filled with the color gray.
 * 3. The gray circle is the selected circle C. Right-clicking C will make a popup menu appear
 *    with one entry “Adjust diameter..”.
 * 4. Clicking on this entry will open another frame with a slider inside that adjusts the diameter of C.
 *    Changes are applied immediately. Closing this frame will mark the last diameter as significant
 *    for the undo/redo history.
 * 5. Clicking undo will undo the last significant change (i.e. circle creation or diameter adjustment).
 * 6. Clicking redo will reapply the last undoed change unless new changes were made by the user in the meantime.
 */
type Circle = {
  cx: number
  cy: number
  r: number
}

export function CircleDrawer({ className }: { className?: string }) {
  const INIT_RADIUS = 20
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [circles, setCircles] = useState<Circle[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [adjusting, setAdjusting] = useState(false)
  const [history, setHistory] = useState<Circle[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const debouncedPushHistory = useDebounceCallback(pushHistory, 500)

  function handleClick(e: MouseEvent<SVGSVGElement>) {
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
      const newCircles = [...circles, { cx: x, cy: y, r: INIT_RADIUS }]
      setCircles(newCircles)
      pushHistory(newCircles)
    }
  }

  function adjust(index: number) {
    setSelectedIndex(index)
    setAdjusting(true)
  }

  function handleAdjustRadius(e: number[]) {
    if (selectedIndex === null) return
    const newCircles = circles.map((circle, index) =>
      index === selectedIndex ? { ...circle, r: e[0] } : circle,
    )
    setCircles(newCircles)
    debouncedPushHistory(newCircles)
  }

  function pushHistory(newCircles: Circle[] = circles) {
    const newHistory = [...history.slice(0, historyIndex + 1), newCircles]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  function undo() {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCircles(history[historyIndex - 1])
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCircles(history[historyIndex + 1])
    }
  }

  return (
    <Wrapper title="Circle Drawer" className={className}>
      <div className="relative h-96 md:size-full">
        <svg ref={svgRef} width="100%" height="100%" onClick={handleClick}>
          {circles.map((circle, i) => (
            <circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              className={cn('stroke-border stroke-2', {
                'fill-primary': selectedIndex === i,
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

        {circles.length === 0 && (
          <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <p>Left-click to add a circle</p>
            <p>Right-click to adjust the diameter</p>
          </div>
        )}

        {adjusting && selectedIndex !== null && (
          <div
            className="absolute inset-0 z-10 mx-10 my-auto grid h-20 rounded-md border bg-background/70 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm">
              Adjust diameter of circle at
              <span className="font-mono">
                ({circles[selectedIndex].cx.toFixed(0)}, {circles[selectedIndex].cy.toFixed(0)}).
              </span>
            </p>
            <Slider
              min={10}
              max={80}
              value={[circles[selectedIndex].r]}
              onValueChange={handleAdjustRadius}
            />
          </div>
        )}
        <div className="absolute bottom-1 right-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={historyIndex <= 0 || adjusting}
          >
            <span className="i-carbon-undo" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={historyIndex >= history.length - 1 || adjusting}
          >
            <span className="i-carbon-redo" />
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}
