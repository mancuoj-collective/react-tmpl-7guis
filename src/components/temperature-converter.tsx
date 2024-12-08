import { useState } from 'react'
import { Input } from './ui/input'
import { Wrapper } from './wrapper'

/**
 * The task is to build a frame containing two textfields TC and TF representing the temperature in Celsius and Fahrenheit, respectively.
 *
 * 1. Initially, both TC and TF are empty.
 * 2. When the user enters a numerical value into TC the corresponding value in TF is automatically updated and vice versa.
 * 3. When the user enters a non-numerical string into TC the value in TF is not updated and vice versa.
 *
 * The formula for converting a temperature C in Celsius into a temperature F in Fahrenheit is C = (F - 32) * (5/9)
 * and the dual direction is F = C * (9/5) + 32.
 */
export function TemperatureConverter() {
  const [celsius, setCelsius] = useState('')
  const [fahrenheit, setFahrenheit] = useState('')

  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\.?0+$/, '')
  }

  const handleCelsiusChange = (value: string) => {
    const num = Number(value)
    setCelsius(value)
    num && setFahrenheit(formatNumber(num * (9 / 5) + 32))
  }

  const handleFahrenheitChange = (value: string) => {
    const num = Number(value)
    setFahrenheit(value)
    num && setCelsius(formatNumber((num - 32) * (5 / 9)))
  }

  return (
    <Wrapper title="TempConv">
      <div className="flex items-center justify-center gap-3 p-5">
        <Input
          className="max-w-32 font-mono"
          value={celsius}
          onChange={(e) => handleCelsiusChange(e.target.value)}
        />
        <div className="shrink-0 text-sm">Celsius =</div>
        <Input
          className="max-w-32 font-mono"
          value={fahrenheit}
          onChange={(e) => handleFahrenheitChange(e.target.value)}
        />
        <div className="shrink-0 text-sm">Fahrenheit</div>
      </div>
    </Wrapper>
  )
}
