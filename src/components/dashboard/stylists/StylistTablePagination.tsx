import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

interface StylistTablePaginationProps<TData> {
  table: Table<TData>;
}

export function StylistTablePagination<TData>({ table }: StylistTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} of{" "}
        {table.getCoreRowModel().rows.length} row(s)
      </div>
      <div className="space-x-2 lg:flex-row">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
