"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
  // TableState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  LoaderCircle,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table as MyTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "../TablePagination";

export function DataTable<T>({
  data,
  columns,
  filter,
  isLoading = false,
  pageCount = 1,
  handleDelete,
  onPaginationChange,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  filter?: keyof T;
  pageCount?: number;
  isLoading?: boolean;
  handleDelete?: (table: Table<T>) => void;
  /** Don't forget to use useCallback hook **/
  onPaginationChange?: (pageIndex: number, perPage: number) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    onPaginationChange?.(pagination.pageIndex, pagination.pageSize);
  }, [onPaginationChange, pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
      pagination,
    },
  });

  // console.log(JSON.stringify({ pagination }, null, 2));

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {filter && (
          <Input
            placeholder="Filter"
            value={
              (table.getColumn(filter as string)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(filter as string)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {handleDelete && (
          <Button
            variant="destructive"
            className="ml-auto"
            onClick={() => {
              handleDelete(table);
            }}
            disabled={!table.getSelectedRowModel().rows.length || isLoading}
          >
            <span className="md:inline hidden">Delete</span> <Trash />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border mb-4">
        <MyTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="cursor-pointer relative"
                      onClick={header.column.getToggleSortingHandler()}
                      key={header.id}
                    >
                      <div className="flex items-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {
                          <span className="ml-1">
                            {{
                              desc: (
                                <ArrowUp size={16} /* className="absolute" */ />
                              ),
                              asc: (
                                <ArrowDown
                                  size={16} /* className="absolute" */
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <span className="inline-block w-4"></span>
                            )}
                          </span>
                        }
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            <TableRow className="border-none">
              <TableCell className="p-0">
                {isLoading && (
                  <div className="flex justify-center items-center absolute top-0 right-0 w-full h-full bg-gray-100 bg-opacity-70 z-[9]">
                    <LoaderCircle className="animate-spin" size={72} />
                  </div>
                )}
              </TableCell>
            </TableRow>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MyTable>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
