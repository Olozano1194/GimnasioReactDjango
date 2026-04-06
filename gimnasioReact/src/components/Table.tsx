import { useState } from "react";
// Table
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    SortingState,
    Column,
} from '@tanstack/react-table';
// Sections
import { PaginationSection } from "./table/section/PaginationSection";


interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    totalRow?: Partial<T> & { id?: number | string };
};


const Table = <T,>({ data, columns, totalRow }: TableProps<T>) => {
    //const [users, setUser] = useState([]);    
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageIndex: 0, pageSize: 5 },
        },
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
    });

    const renderSortIcon = (column: Column<T>) => {
        const sortState = column.getIsSorted();
        return {
            'asc': "⬆️",
            'desc': "⬇️",
            'none': "↕️"
        }[sortState || 'none'];

    };

    return (
        <section className="border border-outline-variant/10 flex flex-col gap-y-4 items-center justify-center overflow-hidden p-4 rounded-xl shadow-sm w-full">
            <div className="overflow-x-auto w-full">
                <table className="border-collapse text-left w-full">
                    <thead className="text-sm lg:text-lg">
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-surface-container-lowest/50">
                                    {
                                        headerGroup.headers.map(header => (
                                            <th key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="border-b border-outline-variant/10 font-black px-6 py-4 text-[11px] text-secondary tracking-widest uppercase">
                                                {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext()
                                                )}
                                                {
                                                    renderSortIcon(header.column)
                                                }
                                            </th>
                                        ))}
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-sm lg:text-lg">
                        {
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="group transition-colors hover:bg-nav/5">
                                    {
                                        row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-5">{flexRender(cell.column.columnDef.cell, cell.getContext())
                                            }</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                        {/* Fila del total que estará siempre al final */}
                        {totalRow && (
                            <tr
                                className="bg-slate-500 text-white font-bold md:text-lg">
                                {table.getAllColumns().map((column) => {
                                    const accessorKey = column.id;
                                    const value = totalRow[accessorKey as keyof typeof totalRow] ?? '';

                                    return (
                                        <td key={column.id} className="border p-2">
                                            {String(value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* contenedor de los btn de paginación */}
                {/* <div className="w-full flex md:justify-center md:items-center gap-x-4 pt-4">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-400 md:ml-0"
                    >
                        Primera Página
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-400"
                    >
                        Página Anterior
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-400"
                    >
                        Página Siguiente
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:bg-gray-400"
                    >
                        Última Página
                    </button>
                </div> */}
                <PaginationSection
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    onPageChange={(page: number) => table.setPageIndex(page - 1)}
                />
            </div>
        </section>
    );
};
export default Table;