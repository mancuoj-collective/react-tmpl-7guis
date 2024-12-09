import { useState } from 'react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Slider } from './ui/slider'
import { Wrapper } from './wrapper'
import NumberFlow from '@number-flow/react'
import { useInterval } from 'usehooks-ts'

/**
 * The task is to build a frame containing a gauge G for the elapsed time e, a label which shows the elapsed time as a numerical value,
 * a slider S by which the duration d of the timer can be adjusted while the timer is running and a reset button R.
 *
 * 1. Adjusting S must immediately reflect on d and not only when S is released.
 * 2. It follows that while moving S the filled amount of G will (usually) change immediately.
 * 3. When e ≥ d is true then the timer stops (and G will be full).
 * 4. If, thereafter, d is increased such that d > e will be true then the timer restarts to tick until e ≥ d is true again.
 * 5. Clicking R will reset e to zero.
 */
export function Timer({ className }: { className?: string }) {
  const [duration, setDuration] = useState(60)
  const [elapsedTime, setElapsedTime] = useState(0)
  const isRunning = elapsedTime < duration

  useInterval(
    () => {
      setElapsedTime((prev) => prev + 1)
    },
    isRunning ? 1000 : null,
  )

  return (
    <Wrapper title="Timer" className={className}>
      <div className="flex grow flex-col gap-5 p-5">
        <div className="flex grow items-center justify-center gap-3">
          <NumberFlow
            value={elapsedTime}
            suffix="s"
            className="font-mono text-xl"
            format={{ minimumIntegerDigits: 2 }}
            willChange
            isolate
            continuous
          />
          <p className="text-muted-foreground">/</p>
          <NumberFlow
            value={duration}
            suffix="s"
            className="font-mono text-xl"
            format={{ minimumIntegerDigits: 2 }}
            willChange
            isolate
            continuous
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <Progress
            value={Math.min((elapsedTime / duration) * 100, 100)}
            className="h-5 w-full rounded"
          />
          <Slider
            defaultValue={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            min={1}
            max={99}
            step={1}
          />
          <Button variant="outline" className="w-full" onClick={() => setElapsedTime(0)}>
            Reset
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}
