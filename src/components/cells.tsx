import { Wrapper } from './wrapper'

export function Cells({ className }: { className?: string }) {
  return (
    <Wrapper title="Cells" className={className}>
      <div className="flex flex-col items-center justify-center gap-3 p-5"></div>
    </Wrapper>
  )
}
