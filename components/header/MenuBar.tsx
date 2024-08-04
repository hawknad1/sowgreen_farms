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
import React, { useEffect, useState } from "react"

const MenuBar = () => {
  const [categories, setCategories] = useState([])

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
        <MenubarTrigger className="p-2 px-4">Shop</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="p-2 px-4">Category</MenubarTrigger>
        <MenubarContent>
          {categories.map((cat) => (
            <MenubarItem key={cat.id}>{cat.categoryName}</MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="p-2 px-4">Blog</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}

export default MenuBar
