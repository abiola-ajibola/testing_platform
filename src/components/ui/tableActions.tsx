import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export function TableActions <T>({baseUrl, onDelete, row}: {baseUrl: string, onDelete: (row: Row<T>) => void, row:Row<T>}) {
    return <DropdownMenu>
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
          to={`/${baseUrl}/view/${row.getValue("id")}`}
        >
          View <Eye />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link
          className={`${buttonVariants({ variant: "default" })} w-full`}
          to={`/${baseUrl}/${row.getValue("id")}`}
        >
          Edit <Edit />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Button
            onClick={() => onDelete(row)}
          variant="destructive"
        >
          Delete <Trash />
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}