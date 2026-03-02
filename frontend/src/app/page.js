"use client"
import React, { useEffect, useState } from "react"
import ProjectCard from "@/components/ProjectCard"
import api from "@/lib/axios"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import FeedSkeleton from "@/components/FeedSkeleton"
import UsersCard from "@/components/UsersCard"

const Page = () => {
  const [projects, setProjects] = useState([])
  const [loading, isLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [users, setUsers] = useState([])
  const user = useAuth()
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/project/feed")
        console.log(res.data.projects)
        setProjects(res.data.projects)
      } catch (err) {
        console.log(err)
      } finally {
        isLoading(false)
      }
    }

    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const res = await api.get('/user?limit=6')
        console.log(res.data.users)
        setUsers(res.data.users)
      } catch (error) {
        console.log(error)
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
    fetchProjects()
  }, [])




  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-14">
          Explore Projects
        </h1>
        {loading ? <FeedSkeleton /> :
          <div className="flex flex-wrap gap-10 justify-center">
            {projects.map((project) => {

              return (
                <ProjectCard key={project._id} project={project} user={user} />
              )
            })}
          </div>
        }

      </div>
      <div className="flex justify-center">
        <button className="text-center mt-5 hover:border-b-2 cursor-pointer transition-all">View all Projects {"-->"}</button>
      </div>
      <Separator className='mt-5' />
      <section className="mt-5"> {/* user fffeed*/}
        <h1 className="text-4xl font-bold text-center mb-14">
          Explore People
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {users.map((user) => {
            const visibleSkills = user.skills.slice(0, 2)
            const remainingCount = user.skills.length - 2
            return (
              <UsersCard key={user._id} user={user} visibleSkills={visibleSkills} remainingCount={remainingCount} />
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Page