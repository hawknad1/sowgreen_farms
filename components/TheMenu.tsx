"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Category, Product } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import SkeletonItems from "./skeletons/SkeletonItems"
import { cva } from "class-variance-authority"

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-6 w-max items-center justify-center rounded-md px-4 py-4 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      active: {
        true: "bg-sowgren_Color text-white",
        false: "bg-background hover:bg-sowgren_Color hover:text-white",
      },
    },
  }
)

function TheMenu() {
  const [categoryList, setCategoryList] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [productList, setProductList] = React.useState([])
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
          setProductList(products)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
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
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="text-sowgren_Color ">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} hover:bg-sowgren_Color hover:text-white active:bg-sowgren_Color`}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-4 text-sowgren_Color  hover:bg-sowgren_Color hover:text-gray-200">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            <ul className="grid gap-4 md:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonItems key={index} />
                  ))
                : productList.slice(0, 6).map((product: Product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center space-x-4 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 h-14 w-14 bg-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={
                            product.imageUrl || product?.images?.[0]?.url || ""
                          }
                          alt={product.categoryName || "Product Image"}
                          width={80}
                          height={80}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      {/* Product Text */}
                      <div className="flex-1">
                        <p className="font-semibold text-sm md:text-base text-sowgren_Color line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  ))}

              {/* "Shop All Products" link */}
              <div
                onClick={() => router.push(`/products`)}
                className="cursor-pointer self-center font-medium text-sm flex justify-center text-sowgren_Color w-full space-x-2 p-2 rounded-md transition-colors hover:text-white hover:bg-sowgren_Color"
              >
                View All Products
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-4 text-sowgren_Color hover:bg-sowgren_Color hover:text-gray-200">
            Category
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            <ul className="grid gap-3 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonItems key={index} />
                  ))
                : categoryList.map((category) => (
                    <Link
                      href={{
                        pathname: "/category",
                        query: { q: category?.categoryName },
                      }}
                      key={category.id}
                      className="flex items-center cursor-pointer space-x-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Image
                        src={category.imageUrl}
                        alt={category.categoryName}
                        width={50}
                        height={50}
                        className="h-12 w-14 object-contain"
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

        <NavigationMenuItem className="text-red-500">
          <Link href="/discount" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} hover:bg-sowgren_Color hover:text-white active:bg-sowgren_Color`}
            >
              Sale
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default TheMenu
