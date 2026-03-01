"use client"
import React, { useEffect, useState } from "react"
import ProjectCard from "@/components/ProjectCard"
import api from "@/lib/axios"
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
import useAuth from "@/hooks/useAuth"
import FeedSkeleton from "@/components/FeedSkeleton"

const Page = () => {
  const [projects, setProjects] = useState([])
  const [loading, isLoading] = useState(true)
  const user = useAuth()
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/project")
        console.log(res.data.projects)
        setProjects(res.data.projects)
      } catch (err) {
        console.log(err)
      } finally {
        isLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-14">
          Explore Projects
        </h1>
        {loading ? <FeedSkeleton/> :
          <div className="flex flex-wrap gap-10 justify-center">
            {projects.map((project) => {

              return (
                <ProjectCard key={project._id} project={project} user={user} />
              )
            })}
          </div>
        }

      </div>
    </div>
  )
}

export default Page