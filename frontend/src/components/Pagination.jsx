function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Назад
            </button>

            <span>
                {' '}
                Страница {currentPage} из {totalPages}
                {' '}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Вперёд
            </button>
        </div>
    );
}

export default Pagination;