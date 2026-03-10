"use client"

import Link from "next/link"
import { Delete, Eye, Menu, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
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
import { Inbox, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "./ui/tooltip"
export default function Navbar() {
  const { user, loading } = useAuth()
  const [notificationLoading, setNotificationLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const router = useRouter()
  const navLinks = [
    { label: "Feed", href: "/", private: true },
    { label: "Explore", href: "/explore", private: true },
    { label: "Create Project", href: "/projects/create", private: true },
    { label: "Requests", href: "/requests", private: true }
  ]

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      router.replace("/login")
      window.location.reload()

    } catch {

    }
  }

  const filteredLinks = navLinks.filter(
    (link) => link.private === !!user
  )
  const markAsRead = async(notificationId)=>{
    try {
      const {data} = await api.patch(`/notification/${notificationId}/read`)
      console.log(data)
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true)
      const { data } = await api.get("/notification")
      setNotifications(data.notifications)
      console.log(data)
    } catch (error) {
      console.log(error)
    } finally {
      setNotificationLoading(false)
    }
  }
  useEffect(() => {
    fetchNotifications()
  }, [])

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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Inbox className="text-sm" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-10 w-full sm:w-[400px] ">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">
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

                    {notifications.map((notification) => {
                      return (
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
                                  <button className="p-2 rounded-md hover:bg-accent transition"
                                    onClick={()=>{markAsRead(notification._id),router.push('/requests')}}
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
                      )
                    })}
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
                    <Link href={`/profile/${user.username}`}>
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