import { useState } from 'react'
import { Wrapper } from './wrapper'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, isBefore } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

/**
 * The task is to build a frame containing a combobox C with the two options “one-way flight” and “return flight”,
 * two textfields T1 and T2 representing the start and return date, respectively, and a button B for submitting the selected flight.
 * 1. T2 is enabled if C’s value is “return flight”.
 * 2. When C has the value “return flight” and T2’s date is strictly before T1’s then B is disabled.
 * 3. When a non-disabled textfield T has an ill-formatted date then T is colored red and B is disabled.
 * 4. When clicking B a message is displayed informing the user of his selection (e.g. “You have booked a one-way flight on 04.04.2014.”).
 * 5. Initially, C has the value “one-way flight” and T1 as well as T2 have the same (arbitrary) date (it is implied that T2 is disabled).
 */
export function FlightBooker({ className }: { className?: string }) {
  const [type, setType] = useState('one-way')
  const [date, setDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>(new Date())
  const isReturn = type === 'return'

  const handleBook = () => {
    const message = isReturn
      ? `You have booked a return flight on ${format(date, 'dd.MM.yyyy')} to ${format(returnDate, 'dd.MM.yyyy')}.`
      : `You have booked a one-way flight on ${format(date, 'dd.MM.yyyy')}.`
    toast.success(message)
  }

  return (
    <Wrapper title="Flight Booker" className={className}>
      <div className="flex flex-col items-center justify-center gap-3 p-5">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="font-sans">
            <SelectItem value="one-way">One-way flight</SelectItem>
            <SelectItem value="return">Return flight</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal font-mono',
                !date && 'text-muted-foreground',
              )}
            >
              <span className="i-carbon-calendar mr-1" />
              {date ? format(date, 'dd.MM.yyyy') : <span>Pick departure date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate: Date | undefined) => newDate && setDate(newDate)}
              initialFocus
              required
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={!isReturn}
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal font-mono',
                !returnDate && 'text-muted-foreground',
              )}
            >
              <span className="i-carbon-calendar mr-1" />
              {returnDate ? format(returnDate, 'dd.MM.yyyy') : <span>Pick return date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={(newDate: Date | undefined) => newDate && setReturnDate(newDate)}
              required
              initialFocus
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleBook}
          disabled={isReturn && isBefore(returnDate, date)}
        >
          Book
        </Button>
      </div>
    </Wrapper>
  )
}
