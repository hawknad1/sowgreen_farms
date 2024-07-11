import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";

const MenuBar = () => {
  return (
    <Menubar className="bg-transparent border-none text-black flex gap-3">
      <MenubarMenu>
        <Link
          href="/"
          className="select-none rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          Home
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">Shop</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Milk</MenubarItem>

          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Vegetables</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Onion</MenubarItem>
              <MenubarItem>Tomatoes</MenubarItem>
              <MenubarItem>Green Pepper</MenubarItem>
              <MenubarItem>Cabbage</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Category</MenubarTrigger>
        <MenubarContent>
          <>
            <MenubarItem>Milk</MenubarItem>

            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Vegetables</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Onion</MenubarItem>
                <MenubarItem>Tomatoes</MenubarItem>
                <MenubarItem>Green Pepper</MenubarItem>
                <MenubarItem>Cabbage</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
          </>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <Link
          href="/"
          className="select-none rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          Blog
        </Link>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenuBar;
