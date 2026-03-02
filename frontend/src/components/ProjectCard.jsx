import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hooks/useAuth"
const ProjectCard = ({ project, user }) => {
    if(!user) return null

    const isOwner = project.owner._id === user.user.user._id
    const isMember = project?.members?.includes(user.user.user._id)
    return (
        <Card
            key={project._id}
        
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
}

export default ProjectCard