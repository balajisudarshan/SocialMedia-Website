"use client"
import React, { useEffect, useState } from "react"
import ProjectCard from "@/components/ProjectCard"
import api from "@/lib/axios"
import { Separator } from "@/components/ui/separator"
import FeedSkeleton from "@/components/FeedSkeleton"
import UsersCard from "@/components/UsersCard"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const Page = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [users, setUsers] = useState([])

  const router = useRouter()
  const { user, loading } = useAuth()

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  // 📦 Fetch data only if user exists
  useEffect(() => {
    if (!user) return

    const fetchProjects = async () => {
      try {
        const res = await api.get("/project/feed")
        setProjects(res.data.projects)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const res = await api.get("/user?limit=6")
        setUsers(res.data.users)
      } catch (error) {
        console.log(error)
      } finally {
        setUsersLoading(false)
      }
    }

    fetchProjects()
    fetchUsers()
  }, [user])

  // ⏳ Wait for auth check
  if (loading) return null

  // ⛔ If not logged in, don't render
  if (!user) return null

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-14">
          Explore Projects
        </h1>

        {isLoading ? (
          <FeedSkeleton />
        ) : (
          <div className="flex flex-wrap gap-10 justify-center">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/view/${project._id}`}
                className="w-full md:w-[47%] lg:w-[45%] bg-card border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <ProjectCard project={project} user={user} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button className="text-center mt-5 hover:border-b-2 cursor-pointer transition-all">
          View all Projects {"-->"}
        </button>
      </div>

      <Separator className="mt-5" />

      <section className="mt-5">
        <h1 className="text-4xl font-bold text-center mb-14">
          Explore People
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {usersLoading ? (
            <FeedSkeleton />
          ) : (
            users.map((userItem) => {
              const visibleSkills = userItem.skills.slice(0, 2)
              const remainingCount = userItem.skills.length - 2

              return (
                <UsersCard
                  key={userItem._id}
                  user={userItem}
                  visibleSkills={visibleSkills}
                  remainingCount={remainingCount}
                  onReqSent={(id)=>{
                    setUsers(prev=>prev.filter(u => u._id !== id))
                  }}
                />
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}

export default Page