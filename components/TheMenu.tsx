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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Category, Product } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

  const SkeletonItem = () => (
    <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-200 animate-pulse">
      <div className="h-12 w-14 bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300" />
        <div className="h-3 w-1/2 bg-gray-300" />
      </div>
    </div>
  )

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-4">Shop</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            <ul className="grid gap-3 md:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonItem key={index} />
                  ))
                : productList.slice(0, 6).map((product: Product) => (
                    <Link
                      href={`/products/${product?.id}`}
                      key={product.id}
                      className="flex items-center cursor-pointer space-x-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.categoryName}
                        width={50}
                        height={50}
                        className="h-12 w-14 object-contain"
                      />
                      <ListItem
                        title={product.title}
                        href={`/product/${product.id}`}
                      >
                        {product.title} description or details.
                      </ListItem>
                    </Link>
                  ))}
              {/* Shop All Products link */}
              <div
                onClick={() => router.push(`/products`)}
                className="cursor-pointer self-center font-medium text-sm flex justify-center text-neutral-600 w-full space-x-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Shop All Products
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-4">
            Category
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 z-50 w-[400px] transform translate-x-0 md:w-[500px] lg:w-[600px] p-4 border border-gray-200 shadow-lg bg-white rounded-md">
            <ul className="grid gap-3 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonItem key={index} />
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

        <NavigationMenuItem>
          <Link href="/discount" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Sale
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
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
