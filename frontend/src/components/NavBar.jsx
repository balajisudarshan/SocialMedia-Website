"use client"

import Link from "next/link"
import { Eye, Menu, Trash2, Inbox, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "./ui/tooltip"

export default function Navbar() {

  const { user, loading } = useAuth()
  const router = useRouter()

  const [notificationLoading, setNotificationLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: "Feed", href: "/", private: true },
    { label: "Explore", href: "/explore", private: true },
    { label: "Create Project", href: "/projects/create", private: true },
    { label: "Requests", href: "/requests", private: true }
  ]

  const filteredLinks = navLinks.filter(link => link.private === !!user)

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      router.replace("/login")
      window.location.reload()
    } catch {}
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notification/${notificationId}/read`)

      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId
            ? { ...n, read: true }
            : n
        )
      )

    } catch (error) {
      console.error(error)
    }
  }

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true)
      const { data } = await api.get("/notification")
      setNotifications(data.notifications)
      console.log(data.notifications)
    } catch (error) {
      console.log(error)
    } finally {
      setNotificationLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleNotificationClick = async (notification) => {

    await markAsRead(notification._id)

    setOpen(false)

    if (notification.type === "project_request") {
      router.push(`/projects/view/${notification.referenceId}`)
      return
    }

    if (notification.type === "connection_request") {
      router.push("/requests")
      return
    }
  }

  return (
    <nav className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="font-bold text-xl">
          CollabSpace
        </Link>

        {user && (
          <div className="hidden md:flex gap-6 items-center text-sm">
            {filteredLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">

          {!loading && !user && (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Sheet open={open} onOpenChange={setOpen}>

                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Inbox />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="p-10 w-full sm:w-[400px]">

                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold">
                      Inbox
                    </h2>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={fetchNotifications}
                    >
                      <RefreshCcw className={`h-4 w-4 ${notificationLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">

                    {notifications.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        0 notifications to display
                      </p>
                    )}

                    {notifications.map((notification) => (

                      <div
                        key={notification._id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted transition"
                      >

                        <Avatar className="h-9 w-9">
                          <AvatarImage src={notification.sender?.avatar} />
                          <AvatarFallback>
                            {notification.sender?.userName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col flex-1 text-sm">
                          <p className="font-medium">
                            {notification.sender?.userName}
                          </p>

                          <p className="text-muted-foreground text-xs">
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-2">

                          <TooltipProvider>

                            <Tooltip>
                              <TooltipTrigger asChild>

                                <button
                                  className="p-2 rounded-md hover:bg-accent transition"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                </button>

                              </TooltipTrigger>

                              <TooltipContent>
                                <p>View</p>
                              </TooltipContent>

                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>

                                <button className="p-2 rounded-md hover:bg-destructive/20 transition">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </button>

                              </TooltipTrigger>

                              <TooltipContent>
                                <p>Delete notification</p>
                              </TooltipContent>

                            </Tooltip>

                          </TooltipProvider>

                        </div>

                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}

                      </div>

                    ))}

                  </div>

                </SheetContent>

              </Sheet>

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.user.profilePic} />
                    <AvatarFallback>
                      {user.user.userName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.user.userName}`}>
                      My Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/my-projects">
                      My Projects
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            </>
          )}

          <div className="md:hidden">

            <Sheet>

              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex flex-col gap-4 mt-18 p-5">

                {user && (
                  <>
                    {filteredLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.label}
                      </Link>
                    ))}

                    <Button variant="destructive" onClick={logout}>
                      Logout
                    </Button>
                  </>
                )}

                {!user && (
                  <>
                    <Link href="/login">
                      <Button className="w-full">Login</Button>
                    </Link>

                    <Link href="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </>
                )}

              </SheetContent>

            </Sheet>

          </div>

        </div>

      </div>
    </nav>
  )
}