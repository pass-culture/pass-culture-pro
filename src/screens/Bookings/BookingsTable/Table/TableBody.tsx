import React from 'react'
import { TableInstance, TableBodyProps } from 'react-table'

interface ITableBodyProps {
  page: TableInstance<ITableBooking>['page']; 
  prepareRow: TableInstance<ITableBooking>['prepareRow']; 
  tableBodyProps: TableBodyProps;
}

const TableBody = ({
  page,
  prepareRow,
  tableBodyProps
}: ITableBodyProps): JSX.Element => (
  <tbody {...tableBodyProps} >
    {page.map(row => {
      prepareRow(row)
      return (
        <tr
          {...row.getRowProps()}
          key={row.getRowProps().key}
        >
          {row.cells.map(cell => (
            <td
              {...cell.getCellProps({ className: cell.column.className })}
              key={cell.getCellProps().key}
            >
              {cell.render('Cell')}
            </td>
          ))}
        </tr>
      )
    })}
  </tbody>
)

export default TableBody
