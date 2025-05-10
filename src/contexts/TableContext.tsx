import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface TableContextType {
  tableId: string | null
  setTableId: (id: string) => void
}

const TableContext = createContext<TableContextType>({
  tableId: null,
  setTableId: () => {},
})

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tableId, _setTableId] = useState<string | null>(
    () => localStorage.getItem('tableId')
  )

  const setTableId = (id: string) => {
    localStorage.setItem('tableId', id)
    _setTableId(id)
  }

  return (
    <TableContext.Provider value={{ tableId, setTableId }}>
      {children}
    </TableContext.Provider>
  )
}

export const useTable = () => useContext(TableContext)
