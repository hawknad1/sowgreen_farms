"use client"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const MenuBar = () => {
  const [categories, setCategories] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories")

        if (res.ok) {
          const categories = await res.json()
          setCategories(categories)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="p-2 px-4">Home</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="p-2 px-4">Category</MenubarTrigger>
        <MenubarContent>
          {categories.map((cat) => (
            <MenubarItem key={cat.id}>
              <Link
                href={{
                  pathname: "/category",
                  query: { q: cat?.categoryName },
                }}
              >
                {cat.categoryName}
              </Link>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger
          onClick={() => router.push("/discount")}
          className="p-2 px-4 text-red-500"
        >
          Sale
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="p-2 px-4">Blog</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}

export default MenuBar
