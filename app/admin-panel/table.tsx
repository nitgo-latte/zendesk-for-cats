"use client"

import { Column, ColumnDef, PaginationState, Table, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { useMediaQuery } from "react-responsive"

import { DialogForm } from "@/components/DialogForm"
import { fetchTickets } from "@/utils/queries"
import { createClient } from "@/utils/supabase/client"
import { Ticket } from "@/utils/types"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useMemo, useState } from "react"

function TableComponent() {
  // const isDesktop = useMediaQuery({ minWidth: 992 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const supabase = createClient()
  const { data: tickets } = useQuery(fetchTickets(supabase))

  const defaultColumns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => "Ticket Id",
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "email",
        header: () => <span>Email</span>,
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "description",
        header: () => <span>Description</span>,
        enableSorting: false,
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "created_at",
        cell: (info) => {
          const datetime = new Date(info.getValue() as string)
          const formattedDatetime = datetime.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          return formattedDatetime
        },
        enableColumnFilter: false,
        header: "CreatedAt",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "id",
        header: () => undefined,
        enableColumnFilter: false,
        enableSorting: false,
        footer: (props) => props.column.id,
      },
    ],
    []
  )
  const mobileColumns = useMemo<ColumnDef<Ticket>[]>(() => {
    const copied = defaultColumns.slice()
    return [copied[0], copied[4], copied[6]]
  }, [])
  const tabletColumns = useMemo<ColumnDef<Ticket>[]>(() => {
    const copied = defaultColumns.slice()
    return [copied[0], copied[1], copied[4], copied[6]]
  }, [])

  return <MyTable data={tickets ?? []} columns={isMobile ? mobileColumns : isTablet ? tabletColumns : defaultColumns} />
}

function MyTable({ data, columns }: { data: Ticket[]; columns: ColumnDef<Ticket>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  })

  return (
    <div className="overflow-x-auto p-0 sm:p-2">
      <div className="h-2" />
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="whitespace-nowrap px-0 sm:px-4 py-2 font-medium text-gray-900">
                    <div
                      {...{
                        className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {idx < headerGroup.headers.length - 1
                        ? {
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string]
                        : null}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} idx={idx} />
                        </div>
                      ) : (
                        <div>
                          <input type="text" className="w-36 border shadow rounded opacity-0" />
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, i) => {
            return (
              <tr key={row.id + i}>
                {row.getVisibleCells().map((cell, j) => {
                  return j < row.getVisibleCells().length - 1 ? (
                    <td key={cell.id + j} className="whitespace-nowrap px-0 sm:px-4 py-2 text-gray-700 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ) : (
                    <td key={cell.id + j} className="whitespace-nowrap px-0 sm:px-4 py-2">
                      {/* <Link href={`/admin-panel/${cell.getValue()}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-700">Resolve</button>
                      </Link> */}
                      <DialogForm ticketId={row.original.id} oldStatus={row.original.status} />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-2 mt-5 sm:mt-16 text-xs sm:text-lg">
        <button className="border rounded p-1" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button className="border rounded p-1" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function Filter({ column, table, idx }: { column: Column<any, any>; table: Table<any>; idx: number }) {
  const columnFilterValue = column.getFilterValue()

  // enable searching for ticket.status only
  return <input type="text" value={(columnFilterValue ?? "") as string} onChange={(e) => column.setFilterValue(e.target.value)} placeholder={`Search...`} className="w-36 border shadow rounded" />
}

export default TableComponent
