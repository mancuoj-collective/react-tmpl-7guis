import { PropsWithChildren } from 'react'

export function Wrapper({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col rounded-lg border shadow-sm">
      <h1 className="border-b p-2.5 text-center text-sm text-muted-foreground">{title}</h1>
      {children}
    </div>
  )
}
