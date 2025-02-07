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
import { auth } from "@/auth"
import { logout } from "@/lib/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useSession } from "next-auth/react"
import UserButton from "../header/UserButton"
import { formatName } from "@/lib/formatName"
import { UserProps } from "@/types"

// interface UserProps {
//   name?: string
//   email?: string
//   role?: string
//   emailVerified?: string
//   image?: string
// }

const Header = async () => {
  const session = await auth()
  const user: UserProps = session?.user

  const firstName = formatName(user?.name)

  return (
    <header className="flex h-14 items-center gap-4 bg-white px-4 lg:h-[60px] lg:px-8">
      <SidebarSheet />

      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-xl font-bold">{`Welcome, ${firstName}!👋🏾`}</p>
        </div>
        <div className="flex items-center space-x-4">
          <DatePickerWithRange />
          <UserButton user={user} />
        </div>
      </div>
    </header>
  )
}

export default Header
