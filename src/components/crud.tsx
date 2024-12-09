import { Wrapper } from './wrapper'

export function CRUD({ className }: { className?: string }) {
  return (
    <Wrapper title="CRUD" className={className}>
      <div className="flex flex-col items-center justify-center gap-3 p-5"></div>
    </Wrapper>
  )
}
