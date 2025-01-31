import React from "react"

interface PaginationButtonsProps {
  productsPerPage: number
  totalProducts: number
  currentPage: number
  paginate: (pageNumber: number) => void
}

const PaginationPageButton: React.FC<PaginationButtonsProps> = ({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  return (
    <div className="flex justify-between gap-2 mt-12 w-full ">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        Next
      </button>
    </div>
  )
}

export default PaginationPageButton
