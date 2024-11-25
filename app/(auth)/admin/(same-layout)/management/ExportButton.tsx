"use client"
import downloadExcel from "@/lib/downloadExcel"

export default function ExportButton() {
  return (
    <button onClick={downloadExcel} className="btn-export">
      Export Data
    </button>
  )
}
