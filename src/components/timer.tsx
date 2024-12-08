import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Slider } from './ui/slider'
import { Wrapper } from './wrapper'

export function Timer() {
  return (
    <Wrapper title="Timer">
      <div className="flex w-72 flex-col items-center justify-center gap-3 p-5">
        <Progress value={33} />
        <Slider defaultValue={[33]} max={100} step={1} />
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </Wrapper>
  )
}
