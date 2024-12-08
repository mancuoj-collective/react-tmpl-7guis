import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center gap-2">
      <Input readOnly value={count} />
      <Button onClick={() => setCount(count + 1)}>Count</Button>
    </div>
  )
}
