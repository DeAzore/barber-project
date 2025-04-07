import React from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

interface StylistTableFilterProps<TData> {
  table: Table<TData>;
}

export function StylistTableFilter<TData>({ table }: StylistTableFilterProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <DataTableViewOptions table={table} />
      <Input
        placeholder="Filtrer les barbiers..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="ml-auto max-w-sm"
      />
    </div>
  );
}
