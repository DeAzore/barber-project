import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { StylistData } from "./StylistsApi";

export const getStylistColumns = (
  handleEditStylist: (stylist: StylistData) => void,
  handleDeleteStylist: (id: string) => void
): ColumnDef<StylistData>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
  },
  {
    accessorKey: "experience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expérience" />
    ),
  },
  {
    accessorKey: "specialties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Spécialités" />
    ),
  },
  {
    accessorKey: "available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disponible" />
    ),
    cell: ({ row }) => (row.original.available ? "Oui" : "Non"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stylist = row.original;

      return (
        <div className="flex justify-end gap-4">
          <Pencil
            size={20}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleEditStylist(stylist)}
          />
          <Trash2
            size={20}
            className="cursor-pointer hover:text-red-500"
            onClick={() => handleDeleteStylist(stylist.id)}
          />
        </div>
      );
    },
  },
];
