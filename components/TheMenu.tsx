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
import { Category } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

function TheMenu() {
  const [categoryList, setCategoryList] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

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
              {categoryList.map((category) => (
                <li
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
                  <ListItem title={category.categoryName} href={category.href}>
                    {category.categoryName} description or details.
                  </ListItem>
                </li>
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
