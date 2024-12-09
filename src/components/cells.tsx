import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Wrapper } from './wrapper'

/**
 * The task is to create a simple but usable spreadsheet application.
 *
 * 1. The spreadsheet should be scrollable.
 * 2. The rows should be numbered from 0 to 99 and the columns from A to Z.
 * 3. Double-clicking a cell C lets the user change C’s formula.
 * 4. After having finished editing the formula is parsed and evaluated and its updated value is shown in C.
 * 5. In addition, all cells which depend on C must be reevaluated.
 * 6. This process repeats until there are no more changes in the values of any cell (change propagation).
 * 7. Note that one should not just recompute the value of every cell but only of those cells that depend on another cell’s changed value.
 * 8. If there is an already provided spreadsheet widget it should not be used. Instead, another similar widget (like JTable in Swing) should be customized to become a reusable spreadsheet widget.
 */
type CellData = {
  formula: string
  value: string
}

type DataState = {
  [key: string]: CellData
}

type DependenciesState = {
  [key: string]: string[]
}

export function Cells({ className }: { className?: string }) {
  const [data, setData] = useState<DataState>({
    A0: { formula: '4', value: '4' },
    B0: { formula: '9', value: '9' },
    A1: { formula: '=A0+B0', value: '13' },
    B1: { formula: '=A0*B0', value: '36' },
    C1: { formula: '=A1+B1', value: '49' },
  })
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [dependencies, setDependencies] = useState<DependenciesState>({
    A1: ['A0', 'B0'],
    B1: ['A0', 'B0'],
    C1: ['A1', 'B1'],
  })

  useEffect(() => {
    const updatedData = { ...data }
    const updatedDependencies = { ...dependencies }
    let hasChanges = false

    Object.keys(data).forEach((cell) => {
      const formula = data[cell].formula
      if (formula.startsWith('=')) {
        const matches = formula.match(/([A-Z]\d+)/g)
        if (matches) {
          updatedDependencies[cell] = matches
        } else {
          updatedDependencies[cell] = []
        }
        const evaluatedValue = evaluateFormula(formula.slice(1), getCellValue)
        if (updatedData[cell].value !== evaluatedValue.toString()) {
          updatedData[cell].value = Number.isNaN(evaluatedValue)
            ? '#ERROR'
            : evaluatedValue.toString()
          hasChanges = true
        }
      } else {
        if (updatedData[cell].value !== formula) {
          updatedData[cell].value = formula
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      setData(updatedData)
      setDependencies(updatedDependencies)
    }
  }, [data])

  function handleDoubleClick(cell: string) {
    setEditingCell(cell)
    setInputValue(data[cell]?.formula || '')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function handleInputBlur() {
    if (editingCell) {
      setData((prevData) => ({
        ...prevData,
        [editingCell]: { formula: inputValue, value: prevData[editingCell]?.value || '' },
      }))
      updateDependentCells(editingCell)
      setEditingCell(null)
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }

  function getCellValue(cell: string) {
    const formula = data[cell]?.formula
    if (formula?.startsWith('=')) {
      return evaluateFormula(formula.slice(1), getCellValue)
    }
    return Number.parseFloat(formula) || 0
  }

  function evaluateFormula(formula: string, getCellValue: (cell: string) => number): number {
    try {
      const value = new Function(
        'getCellValue',
        `return ${formula.replace(/([A-Z]\d+)/g, 'getCellValue("$1")')}`,
      )
      return value(getCellValue)
    } catch {
      return Number.NaN
    }
  }

  function updateDependentCells(cell: string) {
    Object.keys(dependencies).forEach((dependentCell) => {
      if (dependencies[dependentCell].includes(cell)) {
        const formula = data[dependentCell].formula.slice(1)
        const evaluatedValue = evaluateFormula(formula, getCellValue)
        setData((prevData) => ({
          ...prevData,
          [dependentCell]: {
            formula: prevData[dependentCell].formula,
            value: Number.isNaN(evaluatedValue) ? '#ERROR' : evaluatedValue.toString(),
          },
        }))
      }
    })
  }

  return (
    <Wrapper title="Cells" className={className}>
      <ScrollArea className="h-96">
        <Table className="font-mono">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-16 border-r text-center">#</TableHead>
              {Array.from({ length: 26 }).map((_, i) => (
                <TableHead key={i} className="min-w-20 border-r text-center">
                  {String.fromCharCode(65 + i)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 100 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="h-12">
                <TableCell className="border-r text-center text-muted-foreground">
                  {rowIndex}
                </TableCell>
                {Array.from({ length: 26 }).map((_, colIndex) => {
                  const cell = `${String.fromCharCode(65 + colIndex)}${rowIndex}`
                  return (
                    <TableCell
                      key={colIndex}
                      onDoubleClick={() => handleDoubleClick(cell)}
                      className="text-center"
                    >
                      {editingCell === cell ? (
                        <Input
                          className="h-7 rounded p-1 text-sm"
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyDown={handleInputKeyDown}
                          autoFocus
                        />
                      ) : (
                        data[cell]?.value || ''
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Wrapper>
  )
}
