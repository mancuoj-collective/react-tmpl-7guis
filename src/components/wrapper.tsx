import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

export function Wrapper({
  title,
  className,
  children,
}: PropsWithChildren<{ title: string; className?: string }>) {
  return (
    <div className={cn('flex flex-col rounded-lg border shadow', className)}>
      <h1 className="border-b p-2.5 text-center text-sm text-muted-foreground">{title}</h1>
      {children}
    </div>
  )
}
