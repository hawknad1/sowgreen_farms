// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu"
// import { Category, Product } from "@/types"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import SkeletonItems from "./skeletons/SkeletonItems"
// import { cva } from "class-variance-authority"

// const navigationMenuTriggerStyle = cva(
//   "group inline-flex h-6 w-max items-center justify-center rounded-md px-4 py-4 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       active: {
//         true: "bg-sowgren_Color text-white",
//         false: "bg-background hover:bg-sowgren_Color hover:text-white",
//       },
//     },
//   }
// )

// function TheMenu() {
//   const [categoryList, setCategoryList] = React.useState<Category[]>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [loading, setLoading] = React.useState(true)
//   const [productList, setProductList] = React.useState([])
//   const router = useRouter()

//   React.useEffect(() => {
//     async function getProductList() {
//       try {
//         const res = await fetch("/api/products", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const products = await res.json()

//           // Sort products alphabetically by name
//           const sortedProducts = products.sort((a: Product, b: Product) => {
//             const nameA = a.title.toLowerCase() // assuming each product has a 'name' property
//             const nameB = b.title.toLowerCase()
//             if (nameA < nameB) return -1
//             if (nameA > nameB) return 1
//             return 0
//           })

//           setProductList(sortedProducts)
//           setLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getProductList()
//   }, [])

//   React.useEffect(() => {
//     async function getCategories() {
//       try {
//         const res = await fetch("/api/categories", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const categories = await res.json()
//           setCategoryList(categories)
//           setIsLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getCategories()
//   }, [])

//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         <NavigationMenuItem className="text-sowgren_Color ">
//           <Link href="/" legacyBehavior passHref>
//             <NavigationMenuLink
//               className={`${navigationMenuTriggerStyle()} hover:bg-sowgren_Color hover:text-white active:bg-sowgren_Color`}
//             >
//               Home
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="p-4 text-sowgren_Color  hover:bg-sowgren_Color hover:text-gray-200">
//             Shop
//           </NavigationMenuTrigger>
//           <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
//             <ul className="grid gap-4 md:grid-cols-2">
//               {loading
//                 ? Array.from({ length: 6 }).map((_, index) => (
//                     <SkeletonItems key={index} />
//                   ))
//                 : productList.slice(0, 6).map((product: Product) => (
//                     <Link
//                       key={product.id}
//                       href={`/products/${product.id}`}
//                       className="flex items-center space-x-4 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground"
//                     >
//                       {/* Product Image */}
//                       <div className="flex-shrink-0 h-14 w-14 bg-gray-200 rounded-md overflow-hidden">
//                         <Image
//                           src={
//                             product.imageUrl || product?.images?.[0]?.url || ""
//                           }
//                           alt={product.categoryName || "Product Image"}
//                           width={80}
//                           height={80}
//                           className="h-full w-full object-contain p-1"
//                         />
//                       </div>
//                       {/* Product Text */}
//                       <div className="flex-1">
//                         <p className="font-semibold text-sm md:text-base text-sowgren_Color line-clamp-1">
//                           {product.title}
//                         </p>
//                         <p className="text-sm text-gray-500 line-clamp-2">
//                           {product.description}
//                         </p>
//                       </div>
//                     </Link>
//                   ))}

//               {/* "Shop All Products" link */}
//               <div
//                 onClick={() => router.push(`/products`)}
//                 className="cursor-pointer self-center font-medium text-sm flex justify-center text-sowgren_Color w-full space-x-2 p-2 rounded-md transition-colors hover:text-white hover:bg-sowgren_Color"
//               >
//                 View All Products
//               </div>
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="p-4 text-sowgren_Color hover:bg-sowgren_Color hover:text-gray-200">
//             Category
//           </NavigationMenuTrigger>
//           <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
//             <ul className="grid gap-3 md:grid-cols-2">
//               {isLoading
//                 ? Array.from({ length: 8 }).map((_, index) => (
//                     <SkeletonItems key={index} />
//                   ))
//                 : categoryList.map((category) => (
// <Link
//   href={{
//     pathname: "/category",
//     query: { q: category?.categoryName },
//   }}
//   key={category.id}
//   className="flex items-center cursor-pointer space-x-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
// >
//   <Image
//     src={category.imageUrl}
//     alt={category.categoryName}
//     width={50}
//     height={50}
//     className="h-12 w-14 object-contain"
//   />
//   <ListItem
//     title={category.categoryName}
//     href={category.href}
//   >
//     {category.categoryName} description or details.
//   </ListItem>
// </Link>
//                   ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem className="text-red-500">
//           <Link href="/discount" legacyBehavior passHref>
//             <NavigationMenuLink
//               className={`${navigationMenuTriggerStyle()} hover:bg-sowgren_Color hover:text-white active:bg-sowgren_Color`}
//             >
//               Sale
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   )
// }

// export const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 no-underline outline-none transition-colors",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium">{title}</div>
//           <p className="line-clamp-2 text-sm text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   )
// })
// ListItem.displayName = "ListItem"

// export default TheMenu

"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils" // Utility for combining Tailwind classes
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle, // Use the exported style directly if it's available
} from "@/components/ui/navigation-menu" // Assuming these are from Shadcn UI or similar
import { Category, Product } from "@/types" // Your custom types
import Image from "next/image"
import { useRouter } from "next/navigation"
import SkeletonItems from "./skeletons/SkeletonItems" // Your skeleton loader component
import { cva } from "class-variance-authority" // For creating flexible components

// Re-defining navigationMenuTriggerStyle to ensure it's robust and adaptable
// Consider moving this to your component library's utils or where navigation-menuTriggerStyle is defined if it's external
const customNavigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-sowgren_Color hover:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-sowgren_Color data-[active]:text-white data-[state=open]:bg-sowgren_Color/90 data-[state=open]:text-white",
  {
    variants: {
      active: {
        true: "bg-sowgren_Color text-white",
        false: "bg-background hover:bg-sowgren_Color hover:text-white",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

function TheMenu() {
  const [categoryList, setCategoryList] = React.useState<Category[]>([])
  const [productList, setProductList] = React.useState<Product[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          const sortedProducts = products.sort((a: Product, b: Product) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          )
          setProductList(sortedProducts)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error) // Use console.error for errors
      } finally {
        setIsLoadingProducts(false) // Ensure loading state is updated
      }
    }
    getProductList()
  }, [])

  React.useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const categories = await res.json()
          setCategoryList(categories)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    getCategories()
  }, [])

  return (
    <NavigationMenu className="max-w-full justify-center">
      <NavigationMenuList className="flex flex-wrap justify-center">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={customNavigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={customNavigationMenuTriggerStyle()}>
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            <ul className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingProducts
                ? Array.from({ length: 9 }).map((_, index) => (
                    <SkeletonItems key={index} />
                  ))
                : productList.slice(0, 9).map((product: Product) => (
                    <ListItem
                      key={product.id}
                      title={product.title}
                      href={`/products/${product.id}`}
                      imageSrc={
                        product.imageUrl || product?.images?.[0]?.url || ""
                      }
                      imageAlt={product.categoryName || "Product Image"}
                    >
                      {product.description}
                    </ListItem>
                  ))}
              <li className="col-span-full">
                <Link href="/products" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      "flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium transition-colors bg-sowgren_Color text-white hover:bg-sowgren_Color/90",
                      "focus:outline-none focus:ring-2 focus:ring-sowgren_Color focus:ring-offset-2"
                    )}
                  >
                    View All Products
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={customNavigationMenuTriggerStyle()}>
            Category
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            {" "}
            <ul className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingCategories
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonItems key={index} />
                  ))
                : categoryList.map((category) => (
                    <Link
                      href={{
                        pathname: "/category",
                        query: { q: category?.categoryName },
                      }}
                      key={category.id}
                      className="flex items-center cursor-pointer space-x-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Image
                        src={category.imageUrl}
                        alt={category.categoryName}
                        width={50}
                        height={50}
                        className="flex-shrink-0 h-12 w-12 object-contain bg-gray-100 rounded-md overflow-hidden flex items-center justify-center"
                      />
                      <ListItem
                        title={category.categoryName}
                        href={category.href}
                      >
                        {category.categoryName} description or details.
                      </ListItem>
                    </Link>
                  ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/discount" legacyBehavior passHref>
            <NavigationMenuLink className={customNavigationMenuTriggerStyle()}>
              Sale
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string
  imageSrc?: string
  imageAlt?: string
}

// export const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
//   ({ className, title, children, imageSrc, imageAlt, ...props }, ref) => {
//     return (
//       <li>
//         <NavigationMenuLink asChild>
//           <a
//             ref={ref}
//             className={cn(
//               "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//               "flex items-center space-x-4", // Added flex for image and text alignment
//               className
//             )}
//             {...props}
//           >
//             {imageSrc && (
//               <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
//                 <Image
//                   src={imageSrc}
//                   alt={imageAlt || title}
//                   width={64} // Increased image size slightly
//                   height={64}
//                   className="object-contain p-1"
//                 />
//               </div>
//             )}
//             <div className="flex-1">
//               <div className="text-base font-medium leading-none text-sowgren_Color line-clamp-1">
//                 {title}
//               </div>
//               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                 {children}
//               </p>
//             </div>
//           </a>
//         </NavigationMenuLink>
//       </li>
//     )
//   }
// )

export const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, imageSrc, imageAlt, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "flex items-center space-x-3", // Reduced space-x from 4 to 3
              className
            )}
            {...props}
          >
            {imageSrc && (
              <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                {" "}
                {/* Adjusted h-12 w-12 from h-16 w-16 */}
                <Image
                  src={imageSrc}
                  alt={imageAlt || title}
                  width={48} // Adjusted width from 64
                  height={48} // Adjusted height from 64
                  className="object-contain p-1"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium leading-none text-sowgren_Color line-clamp-1">
                {" "}
                {/* Adjusted text-base to text-sm */}
                {title}
              </div>
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {" "}
                {/* Adjusted text-sm to text-xs */}
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

export default TheMenu
