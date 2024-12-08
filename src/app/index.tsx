import { Button } from '@/components/ui/button'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { AppProvider } from './provider'
import { Counter } from '@/components/counter'

export function App() {
  return (
    <AppProvider>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Counter />
        <div className="mt-8 space-x-2">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a href="https://github.com/mancuoj-collective/react-tmpl-7guis">
              <span className="i-carbon-logo-github" />
            </a>
          </Button>
          <DarkModeToggle className="rounded-full" />
        </div>
      </div>
    </AppProvider>
  )
}
