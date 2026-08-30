 // components/ui/DataTable.tsx
import { Button } from "./Button";
import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode; // optional custom cell renderer
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getRowId: (row: T) => string | number;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  getRowId,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="py-10 text-center text-sm text-gray-400">Memuat data...</div>;
  }

  if (data.length === 0) {
    return <div className="py-10 text-center text-sm text-gray-400">Tidak ada data.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-medium text-gray-500">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right font-medium text-gray-500">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={getRowId(row)} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right space-x-1">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
