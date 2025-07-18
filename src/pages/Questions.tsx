import { ResponseWithPagination } from "@/api/baseClients";
import { question as client, question, QuestionResponse } from "@/api/question";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/dataTable";
import { TableActions } from "@/components/ui/tableActions";
import { buttonVariants } from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

export function Questions() {
  const [isLoading, setIsLoading] = useState(false);
  const _questions = useLoaderData<{
    data: ResponseWithPagination<{ questions: QuestionResponse[] }>;
  }>();

  const [questionsData, setQuestionssData] = useState<{
    data: ResponseWithPagination<{ questions: QuestionResponse[] }>;
  } | null>(null);

  const questions = questionsData?.data.questions || _questions.data.questions;
  const { perPage, total } = questionsData?.data || _questions.data || {};

  const handlePaginationChange = useCallback(
    async (pageNumber: number, perPage: number) => {
      setIsLoading(true);
      try {
        const q = await question.getMany({ page: pageNumber + 1, perPage });
        setQuestionssData(q || null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleMultiDelete = useCallback(() => {
    return async function (table: Table<QuestionResponse>) {
      setIsLoading(true);
      try {
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
        setQuestionssData(data ? data : null);
      } finally {
        setIsLoading(false);
      }
    };
  }, []);

  async function handleSingleDelete(row: Row<QuestionResponse>) {
    setIsLoading(true);
    try {
      console.log({ id: row.getValue("id") });
      row.toggleSelected(false);
      await client.delete(row.getValue("id"));
      const data = await client.getMany();
      console.log({ data });
      setQuestionssData(data ? data : null);
    } finally {
      setIsLoading(false);
    }
  }

  const columns: ColumnDef<QuestionResponse>[] = useMemo(
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
          return <div>{props.row.getValue("id")}</div>;
        },
        header: () => {
          return <div>ID</div>;
        },
      },
      {
        accessorKey: "text",
        header: "Preview",
        cell: ({ row }) => (
          <div>{(row.getValue("text") as string).substring(0, 25)}</div>
        ),
        sortDescFirst: true,
      },
      {
        id: "actions",
        header: () => <div className="text-center mx-auto">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <TableActions<QuestionResponse>
              row={row}
              baseUrl="admin/_questions"
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
        <h1>Questions</h1>
        <Link className={buttonVariants()} to="/admin/_questions/new">
          Create Question <Plus />
        </Link>
      </div>
      <DataTable<QuestionResponse>
        filter={"text"}
        columns={columns}
        data={questions}
        handleDelete={handleMultiDelete()}
        pageCount={total / perPage > 0 ? Math.ceil(total / perPage) : 1}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
      />
    </div>
  );
}
