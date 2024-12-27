import { useEffect, useState } from "react";

//Enlaces
import { Link } from "react-router-dom";
// Table
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';


const Table = ({data, columns}) => {
    const [users, setUser] = useState([]);    
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data, 
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting 
        },
        onSortingChange: setSorting,              
    });

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4' >Listado de Usuarios</h1>
            <table className="min-w-full border"> 
                <thead className="bg-slate-500 text-white">
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="p-2">
                                                {header.isPlaceholder ? null :
                                                flexRender(header.column.columnDef.header, header.getContext())}

                                                {
                                                    {'asc' : "⬆️", 'desc' : "⬇️", 'none' : "↕️"}[header.column.getIsSorted() ?? null]                                   
                                                }                                            
                                        </th>                                        
                                    ))}                                
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {
                                    row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="border p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())
                                        }</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {/* contenedor de los btn de paginación */}
            <div className="flex justify-center items-center gap-x-4">
                <button onClick={() => table.setPageIndex(0)} >
                    Primera Página
                </button>
                <button onClick={() => table.previousPage()}>
                    Página Anterior
                </button>
                <button onClick={() => table.nextPage()}>
                    Página Siguiente
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                    Última Página
                </button>

            </div>           
        </main>
    );

}
export default Table;