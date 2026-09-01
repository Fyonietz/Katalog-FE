// src/components/ui/DataTable.tsx
import React from "react";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string | number;
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        {/* HEADER TABEL */}
        <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <tr>
            {columns.map((col, index) => (
              /* FIX KEY PADA <th> */
              <th key={col.header || `col-${index}`} className="px-6 py-4">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th key="col-aksi" className="px-6 py-4 text-right">Aksi</th>}
          </tr>
        </thead>

        {/* BODY TABEL */}
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-12 text-gray-400">
                Memuat data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-12 text-gray-400">
                Tidak ada data tersedia.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              /* FIX KEY PADA <tr> BARIS TABEL */
              const rowKey = getRowId ? getRowId(row, rowIndex) : `row-${rowIndex}`;

              return (
                <tr key={rowKey} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    /* FIX KEY PADA <td> SEL TABEL */
                    <td key={`${rowKey}-col-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                      {col.accessor(row)}
                    </td>
                  ))}

                  {(onEdit || onDelete) && (
                    <td key={`${rowKey}-aksi`} className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
