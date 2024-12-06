import { Toaster } from '@/components/ui/sonner'
import { Provider } from 'jotai'
import { PropsWithChildren } from 'react'

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <Provider>
      <div className="font-inter antialiased">{children}</div>
      <Toaster richColors />
    </Provider>
  )
}
