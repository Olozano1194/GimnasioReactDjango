import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function PaginationSection({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        start = 1;
        end = Math.min(totalPages, maxVisible);
    }

    if (currentPage > totalPages - 3) {
        start = Math.max(1, totalPages - maxVisible + 1);
        end = totalPages;
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <nav className="flex justify-center items-center mt-6">
            <div className="flex items-center gap-2">

                {/* Flecha izquierda */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition disabled:opacity-30"
                >
                    <FaChevronLeft />
                </button>

                {/* Primera página + ... */}
                {start > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                            1
                        </button>

                        {start > 2 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}
                    </>
                )}

                {/* Páginas visibles */}
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg border transition ${currentPage === page
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-200 hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* ... + última página */}
                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}

                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Flecha derecha */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition disabled:opacity-30"
                >
                    <FaChevronRight />
                </button>
            </div>
        </nav>
    );
}