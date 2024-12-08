import { useState } from 'react'
import { Wrapper } from './wrapper'
import { Button } from './ui/button'
import { Input } from './ui/input'

/**
 * The task is to build a frame containing a label or read-only textfield T and a button B.
 * 1. Initially, the value in T is “0”
 * 2. and each click of B increases the value in T by one.
 */
export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <Wrapper title="Counter">
      <div className="flex items-center justify-center gap-3 p-5">
        <Input readOnly className="w-full md:w-32" value={count} />
        <Button variant="outline" onClick={() => setCount(count + 1)}>
          Count
        </Button>
      </div>
    </Wrapper>
  )
}
