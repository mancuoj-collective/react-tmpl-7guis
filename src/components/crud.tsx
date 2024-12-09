import { useState } from 'react'
import { Wrapper } from './wrapper'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

/**
 * The task is to build a frame containing the following elements: a textfield Tprefix,
 * a pair of textfields Tname and Tsurname, a listbox L, buttons BC, BU and BD and
 * the three labels as seen in the screenshot.
 *
 * 1. L presents a view of the data in the database that consists of a list of names.
 * 2. At most one entry can be selected in L at a time.
 * 3. By entering a string into Tprefix the user can filter the names whose surname start with
 *    the entered prefix—this should happen immediately without having to submit the prefix with enter.
 * 4. Clicking BC will append the resulting name from concatenating the strings in Tname and Tsurname to L.
 * 5. BU and BD are enabled if an entry in L is selected. In contrast to BC, BU will not append the resulting name
 *    but instead replace the selected entry with the new name. BD will remove the selected entry.
 * 6. The layout is to be done like suggested in the screenshot. In particular, L must occupy all the remaining space.
 */
type Person = {
  id: string
  name: string
  surname: string
}

export function CRUD({ className }: { className?: string }) {
  const [list, setList] = useState<Person[]>([
    { id: '1', name: 'Emil', surname: 'Hans' },
    { id: '2', name: 'Mustermann', surname: 'Max' },
    { id: '3', name: 'Titch', surname: 'Roman' },
  ])
  const [filter, setFilter] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [selected, setSelected] = useState<Person | null>(null)
  const filteredList = list.filter((person) =>
    person.surname.toLowerCase().startsWith(filter.toLowerCase()),
  )

  function clearSelected() {
    setSelected(null)
    setName('')
    setSurname('')
  }

  function handleSelect(person: Person) {
    if (selected?.id === person.id) {
      clearSelected()
    } else {
      setSelected(person)
      setName(person.name)
      setSurname(person.surname)
    }
  }

  function handleCreate() {
    if (!name || !surname) return
    setList((prev) => [...prev, { id: crypto.randomUUID(), name, surname }])
    clearSelected()
  }

  function handleUpdate() {
    if (!selected) return
    setList((prev) =>
      prev.map((person) => (person.id === selected.id ? { ...person, name, surname } : person)),
    )
    clearSelected()
  }

  function handleDelete() {
    if (!selected) return
    setList((prev) => prev.filter((person) => person.id !== selected.id))
    clearSelected()
  }

  return (
    <Wrapper title="CRUD" className={className}>
      <div className="flex flex-col items-center justify-center gap-3 p-5">
        <Input
          placeholder="Filter prefix"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <ScrollArea className="flex h-48 w-full select-none flex-col rounded-md border shadow">
          {filteredList.map((person) => (
            <div
              key={person.id}
              className={cn(
                'flex justify-between items-center py-1.5 px-3 text-sm',
                selected?.id === person.id && 'bg-primary text-primary-foreground',
              )}
              onClick={() => handleSelect(person)}
            >
              <p>
                {person.name}, {person.surname}
              </p>
              {selected?.id === person.id && <div className="i-carbon-checkmark" />}
            </div>
          ))}
        </ScrollArea>
        <div className="flex w-full gap-2">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="flex w-full select-none gap-2">
          <Button variant="outline" className="grow" onClick={handleCreate}>
            Create
          </Button>
          <Button variant="outline" className="grow" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outline" className="grow" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}
