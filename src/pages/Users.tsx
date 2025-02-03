import { LoginResponse } from "@/api/auth";import { ResponseWithPagination } from "@/api/baseClients";
;
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Link, useLoaderData } from "react-router-dom";

interface IUser {
  id: number;
  username: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  role: "ADMIN" | "STUDENT";
}

function handleSingleDelete(row: Row<IUser>) {
  console.log({ id: row.getValue("id") });
  row.toggleSelected(false);
}

const columns: ColumnDef<IUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    enableHiding: false,
    cell(props) {
      return <div className="hidden">{props.row.getValue("id")}</div>;
    },
    header: () => {
      return <div className="hidden">ID</div>;
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
    sortDescFirst: true,
  },
  {
    accessorKey: "first_name",
    header: "First name",
    cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "middle_name",
    header: "Middle name",
    cell: ({ row }) => <div>{row.getValue("middle_name")}</div>,
  },
  {
    accessorKey: "last_name",
    header: "Last name",
    cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "role",
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("role")}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center mx-auto">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 p-0 w-full">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                className={`${buttonVariants({ variant: "default" })} w-full`}
                to={`/_users/view/${row.getValue("id")}`}
              >
                View <Eye />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className={`${buttonVariants({ variant: "default" })} w-full`}
                to={`/_users/${row.getValue("id")}`}
              >
                Edit <Edit />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                onClick={() => handleSingleDelete(row)}
                variant="destructive"
              >
                Delete <Trash />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function handleMultiDelete(table: Table<IUser>) {
  const model = table.getSelectedRowModel();
  model.rows.forEach((row) => {
    console.log({ row: row.getValue("id") });
  });
  table.resetRowSelection();
}

export function Users() {
  const { users, perPage, total } =
    useLoaderData<ResponseWithPagination<{ users: LoginResponse[] }>>();
  return (
    <div>
      <div className="flex justify-between">
        <h1>Users</h1>
        <Link className={buttonVariants()} to="/_users/new">
          Create User <Plus />
        </Link>
      </div>
      <DataTable<IUser>
        filter={"username"}
        columns={columns}
        data={users}
        handleDelete={handleMultiDelete}
        pageCount={total / perPage > 0 ? Math.ceil(total / perPage) : 1}
      />
    </div>
  );
}
