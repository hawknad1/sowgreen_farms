import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./DatePicker"
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import { CircleUser, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SidebarSheet from "./SidebarSheet"

const Header = () => {
  return (
    <header className="flex h-14 items-center gap-4 bg-white px-4 lg:h-[60px] lg:px-8">
      <SidebarSheet />
      {/* <div className="w-full flex-1">
        <form>
          <div className="relative ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-2/3 "
            />
          </div>
        </form>
      </div> */}

      <div className="flex items-center justify-between w-full">
        <DatePickerWithRange />
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-5">
            <Button className="flex items-center gap-x-1.5 px-4 py-2">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
