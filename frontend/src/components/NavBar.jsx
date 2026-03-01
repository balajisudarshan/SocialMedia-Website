"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import useAuth from "@/hooks/useAuth"
import api from "@/lib/axios"

export default function Navbar() {
  const { user, loading } = useAuth()

  const navLinks = [
    { label: "Feed", href: "/", private: true },
    { label: "Explore", href: "/explore", private: true },
    { label: "Create Project", href: "/projects/create", private: true },
    { label: "Requests", href: "/requests", private: true }
  ]

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      window.location.reload()
    } catch {}
  }

  const filteredLinks = navLinks.filter(
    (link) => link.private === !!user
  )

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.profilePic} />
                  <AvatarFallback>
                    {user.username?.charAt(0)}
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
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex flex-col gap-4 mt-10">

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