"use client"
import React, { useEffect, useState } from "react"
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

const Page = () => {
  const [projects, setProjects] = useState([])
  const user = useAuth()
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/project")
        console.log(res.data.projects)
        setProjects(res.data.projects)
      } catch (err) {
        console.log(err)
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

        <div className="flex flex-wrap gap-10 justify-center">
          {projects.map((project) => {
            const isOwner = project.owner._id === user.user.user._id
            const isMember = project?.members?.includes(user.user.user._id)
            return (
              <Card
                key={project._id}
                className="w-full md:w-[47%] lg:w-[45%] bg-card border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {project.projectName}
                    </CardTitle>

                    <Badge
                      variant="secondary"
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech + project._id}
                        variant="outline"
                        className="px-3 py-1 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="capitalize">
                        Visibility: {project.visibility}
                      </span>
                      <span>
                        Code: {project.projectCode}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-right">
                      <span>
                        Created:
                      </span>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                </CardContent>

                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <Avatar>
                      <AvatarImage src={project?.owner?.avatar} />
                      <AvatarFallback>{project.owner.userName?.charAt(0).toUpperCase()} </AvatarFallback>
                    </Avatar>
                    <p>{project?.owner?.userName} {isOwner ? "(You)" : ""}</p>
                  </div>
                  {isOwner ? (
                    <Button size="sm" variant="outline" >
                      View Project
                    </Button>
                  ) : isMember ? (
                    <Button size="sm" variant="outline" disabled>
                      Member
                    </Button>
                  ) : (
                    <Button size="sm">
                      Request to Join
                    </Button>
                  )}
                </CardFooter>

              </Card>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Page