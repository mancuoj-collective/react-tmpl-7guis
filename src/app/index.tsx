import { Button } from '@/components/ui/button'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { AppProvider } from './provider'

export function App() {
  return (
    <AppProvider>
      <div className="flex min-h-svh items-center justify-center gap-2">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <a href="https://github.com/mancuoj-collective/react-tmpl-7guis">
            <span className="i-carbon-logo-github" />
          </a>
        </Button>
        <DarkModeToggle className="rounded-full" />
      </div>
    </AppProvider>
  )
}
