// import { useRouter } from "next/navigation"
// import toast from "react-hot-toast"

// const handleDelete = async (productId: string) => {
//   const router = useRouter()
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_URL}/api/products/${product.id}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )

//     if (!res.ok) throw new Error("Failed to delete product")

//     toast.success(`${product.title} deleted successfully!`)
//     router.push("/account/admin/products")
//   } catch (error) {
//     toast.error("Error deleting product.")
//     console.error("Delete product error:", error)
//   }
// }
