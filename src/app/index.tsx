import { Button } from '@/components/ui/button'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { AppProvider } from './provider'
import { Counter } from '@/components/counter'
import { TemperatureConverter } from '@/components/temperature-converter'
import { FlightBooker } from '@/components/flight-booker'
import { Timer } from '@/components/timer'
import { CRUD } from '@/components/crud'
import { CircleDrawer } from '@/components/circle-drawer'
import { Cells } from '@/components/cells'

export function App() {
  return (
    <AppProvider>
      <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-8 p-12">
        <div className="grid gap-4 md:grid-cols-12">
          <Counter className="md:col-span-4" />
          <TemperatureConverter className="md:col-span-8" />
          <FlightBooker className="md:col-span-5" />
          <Timer className="md:col-span-7" />
          <CRUD className="md:col-span-6" />
          <CircleDrawer className="md:col-span-6" />
          <Cells className="md:col-span-12" />
        </div>
        <div className="space-x-2 text-right">
          <DarkModeToggle className="rounded-full" />
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a href="https://github.com/mancuoj-collective/react-tmpl-7guis">
              <span className="i-carbon-logo-github" />
            </a>
          </Button>
        </div>
      </div>
    </AppProvider>
  )
}
