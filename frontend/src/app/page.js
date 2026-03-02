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
import { Linkedin, Github, MessageCircle } from "lucide-react"

const Page = () => {
  const [projects, setProjects] = useState([])
  const [loading, isLoading] = useState(true)
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
        const res = await api.get('/user?limit=6')
        console.log(res.data.users)
        setUsers(res.data.users)
      } catch (error) {
        console.log(error)
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

        <div className="flex gap-4 justify-center">
          {users.map((user) => {
            const visibleSkills = user.skills.slice(0, 2)
            const remainingCount = user.skills.length - 2
            return (
              <div key={user._id} className="w-full md:w-[45%] lg:w-[30%] p-6 bg-card border rounded shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-start gap-4 ">
                  <Avatar className='h-14 w-14'>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className='text-lg font-semibold'>{user.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-lg leading-tight">{user.firstName} {user.lastName}</h1>
                    <h2 className="text-sm text-muted-foreground">@{user.userName}</h2>
                    <h2 className="text-xs text-muted-foreground mt-1">Connctions : {user.following.length}</h2>
                  </div>

                </div>


                <div className="flex flex-wrap gap-3 mt-4">
                  {visibleSkills.map((skill) => {
                    return (
                      <Badge key={skill}>{skill}</Badge>
                    )
                  })}
                  {remainingCount > 0 && (
                    <Badge>+ {(remainingCount)}</Badge>
                  )}
                </div>
                <div className="flex justify-between mt-3">
                  <div className="flex gap-2 mt-2">

                    {user.contactLinks.discord && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <MessageCircle size={16} />
                      </Button>
                    )}

                    {user.contactLinks.linkedIn && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2 hover:bg-blue-600">
                        <Linkedin size={16} />
                      </Button>
                    )}

                    {user.contactLinks.github && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Github size={16} />
                      </Button>
                    )}
                  </div>
                  <Button>Connect</Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Page