"use client"
import React, { useState, useEffect, useRef } from "react"
import api from "@/lib/axios"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { use } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SKILLS } from "@/constants/skills"

const Profile = ({ params }) => {
  const { id } = use(params)

  const [user, setUser] = useState(null)
  const [formData,setFormData] = useState({
    bio:user.bio,
    skills:user.skills,
    contactLinks:{
      github:user.github,
      linkedIn:user.linkedIn,
      discord:user.discord
    }
  })
  const { user: currentUser, loading } = useAuth()
  const router = useRouter()

  const [query, setQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState([])
  const dropdownRef = useRef(null)

  const isMine = currentUser?.user?._id === user?._id

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login")
    }
  }, [loading, currentUser])

  useEffect(() => {
    if (loading) return
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`)
        setUser(res.data.user)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [id, loading])

  useEffect(() => {
    if (user?.skills) {
      setSelectedSkills(user.skills)
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredSkills = SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(query.toLowerCase()) &&
      !selectedSkills.includes(skill)
  )

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    )
  }

  return (
    <Dialog>
      <div className="min-h-screen bg-black text-white">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600" />

        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center -mt-16">
            <div className="relative flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center text-3xl font-bold">
                {user.userName?.charAt(0)}
              </div>

              {isMine && (
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-3 rounded-full"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-semibold">
              {user.userName}
            </h1>

            <p className="text-zinc-400 text-sm">
              {user.firstName} {user.lastName}
            </p>

            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-semibold">
                  {user.followers.length}
                </span>{" "}
                Followers
              </div>
              <div>
                <span className="font-semibold">
                  {user.following.length}
                </span>{" "}
                Following
              </div>
            </div>

            <p className="mt-4 text-center text-zinc-300 max-w-xl">
              {user.bio || "No bio available"}
            </p>
          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">
            <h2 className="text-lg font-semibold mb-3">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {user.skills.length === 0 ? (
                <p className="text-zinc-500">No skills added</p>
              ) : (
                user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">
            <h2 className="text-lg font-semibold mb-3">Links</h2>

            <div className="flex flex-col gap-2 text-sm">
              {user?.contactLinks?.github && (
                <a
                  href={user.contactLinks.github}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  GitHub
                </a>
              )}

              {user?.contactLinks?.linkedIn && (
                <a
                  href={user.contactLinks.linkedIn}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn
                </a>
              )}

              {!user?.contactLinks?.github &&
                !user?.contactLinks?.linkedIn && (
                  <p className="text-zinc-500">
                    No links available
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Edit your profile and hit Save
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className='text-xl'>Bio</Label>
            <Textarea defaultValue={formData.bio} />
          </div>

          <div>
            <Label>Skills</Label>

            <div ref={dropdownRef} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Search skills..."
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none"
              />

              {dropdownOpen && query && filteredSkills.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-44 overflow-y-auto border border-border rounded-lg bg-background shadow-lg text-sm">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        if (!selectedSkills.includes(skill)) {
                          setSelectedSkills([
                            ...selectedSkills,
                            skill,
                          ])
                        }
                        setQuery("")
                        setDropdownOpen(false)
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer text-xs px-2 py-1"
                    onClick={() =>
                      setSelectedSkills(
                        selectedSkills.filter(
                          (s) => s !== skill
                        )
                      )
                    }
                  >
                    {skill} ✕
                  </Badge>
                ))}
              </div>
            )}
          </div>


          <div className="flex flex-col gap-3">
            <h3 className='text-center text-xl text-violet-300 font-bold'>Contact Links</h3>
            <div className="flex flex-col gap-4">
              <div className=" flex flex-col gap-2">
                <Label>GitHub</Label>
                <input
                  type="text"
                  defaultValue={user?.contactLinks?.github}
                  placeholder="GitHub URL"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none"
                />
              </div>
              <div className=" flex flex-col gap-2">
                <Label>LinkedIn</Label>
                <input
                  type="text"
                  defaultValue={user?.contactLinks?.linkedin}
                  placeholder="GitHub URL"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Discord</Label>
                <input
                  type="text"
                  defaultValue={user?.contactLinks?.discord}
                  placeholder="GitHub URL"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}

export default Profile