import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Slider } from './ui/slider'
import { Wrapper } from './wrapper'

export function Timer({ className }: { className?: string }) {
  return (
    <Wrapper title="Timer" className={className}>
      <div className="flex grow flex-col gap-5 p-5">
        <div className="flex grow items-center">time</div>
        <div className="flex flex-col items-center justify-center gap-4">
          <Progress value={33} />
          <Slider defaultValue={[33]} max={100} step={1} />
          <Button variant="outline" className="w-full">
            Reset
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}
