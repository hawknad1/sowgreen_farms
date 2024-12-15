import { auth } from "@/auth"

const AppSidebarWrapper = async () => {
  const session = await auth() // Fetch session on the server
  // return <AppSidebar session={session} />
}

export default AppSidebarWrapper
