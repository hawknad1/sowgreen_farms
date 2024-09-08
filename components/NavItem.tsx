// import clsx from "clsx"
// import { Badge } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"

// const NavItem = ({ href, icon, label, badge }) => {
//   const router = useRouter()
//   const isActive = router.pathname === href

//   return (
//     <Link
//       href={href}
//       className={clsx(
//         "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
//         isActive
//           ? "bg-muted text-primary"
//           : "text-muted-foreground hover:text-primary"
//       )}
//     >
//       {icon}
//       {label}
//       {badge && (
//         <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
//           {badge}
//         </Badge>
//       )}
//     </Link>
//   )
// }

// export default NavItem
