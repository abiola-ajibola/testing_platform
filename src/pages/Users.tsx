import { LoginResponse } from "@/api/auth";
import { ResponseWithPagination } from "@/api/baseClients";
import { users as client } from "@/api/users";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/dataTable";
import { TableActions } from "@/components/ui/tableActions";
import { buttonVariants } from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

interface IUser {
  id: number;
  username: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  role: "ADMIN" | "STUDENT";
}

export function Users() {
  const [userData, setUserData] = useState<ResponseWithPagination<{
    users: LoginResponse[];
  }> | null>(null);

  const loadedData =
    useLoaderData<ResponseWithPagination<{ users: LoginResponse[] }>>();

  const { users, perPage, total } = userData || loadedData || {};

  const handleMultiDelete = useCallback(() => {
    return async function (table: Table<IUser>) {
      const model = table.getSelectedRowModel();
      await Promise.all(
        model.rows.map(async (row) => {
          console.log({ row: row.getValue("id") });
          return await client.delete(row.getValue("id"));
        })
      );
      table.resetRowSelection();
      const data = await client.getMany();
      console.log({ data });
      setUserData(data ? data : null);
    };
  }, []);

  async function handleSingleDelete(row: Row<IUser>) {
    console.log({ id: row.getValue("id") });
    row.toggleSelected(false);
    await client.delete(row.getValue("id"));
    const data = await client.getMany();
    console.log({ data });
    setUserData(data ? data : null);
  }

  const columns: ColumnDef<IUser>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
            <TableActions<IUser>
              row={row}
              baseUrl="admin/_users"
              onDelete={handleSingleDelete}
            />
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1>Users</h1>
        <Link className={buttonVariants()} to="/admin/_users/new">
          Create User <Plus />
        </Link>
      </div>
      <DataTable<IUser>
        filter={"username"}
        columns={columns}
        data={users}
        handleDelete={handleMultiDelete()}
        pageCount={total / perPage > 0 ? Math.ceil(total / perPage) : 1}
      />
    </div>
  );
}
