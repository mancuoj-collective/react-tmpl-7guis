import { Wrapper } from './wrapper'

export function CircleDrawer({ className }: { className?: string }) {
  return (
    <Wrapper title="Circle Drawer" className={className}>
      <div className="flex flex-col items-center justify-center gap-3 p-5"></div>
    </Wrapper>
  )
}
