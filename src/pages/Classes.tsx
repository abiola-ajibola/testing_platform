import { ResponseWithPagination } from "@/api/baseClients";
import { classes as client, ClassResponse } from "@/api/classes";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/dataTable";
import { TableActions } from "@/components/ui/tableActions";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

export function Classes() {
  const _classes = useLoaderData<{
    data: ResponseWithPagination<{ classes: ClassResponse[] }>;
  }>();

  const [classesData, setClassesData] = useState<{
    data: ResponseWithPagination<{ classes: ClassResponse[] }>;
  } | null>(null);

  const classes = classesData?.data.classes || _classes.data.classes;
  const { perPage, total } = classesData?.data || _classes.data || {};

  const handleMultiDelete = useCallback(() => {
    return async function (table: Table<ClassResponse>) {
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
      setClassesData(data ? data : null);
    };
  }, []);

  async function handleSingleDelete(row: Row<ClassResponse>) {
    console.log({ id: row.getValue("id") });
    row.toggleSelected(false);
    await client.delete(row.getValue("id"));
    const data = await client.getMany();
    console.log({ data });
    setClassesData(data ? data : null);
  }

  const columns: ColumnDef<ClassResponse>[] = useMemo(() => [
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
        return <div>{props.row.getValue("id")}</div>;
      },
      header: () => {
        return <div>ID</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      sortDescFirst: true,
    },
    {
      accessorKey: "description",
      header: "Descripiton",
      cell: ({ row }) => (
        <div>{(row.getValue("description") as string).substring(0, 20)}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center mx-auto">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <TableActions<ClassResponse>
            row={row}
            baseUrl="admin/_classes"
            onDelete={handleSingleDelete}
          />
        );
      },
    },
  ], []);

  return (
    <div>
      <div className="flex justify-between">
        <h1>Classes</h1>
        <Link className={buttonVariants()} to="/admin/_classes/new">
          Create Class <Plus />
        </Link>
      </div>
      <DataTable<ClassResponse>
        filter={"name"}
        columns={columns}
        data={classes}
        handleDelete={handleMultiDelete()}
        pageCount={total / perPage > 0 ? Math.ceil(total / perPage) : 1}
      />
    </div>
  );
}
