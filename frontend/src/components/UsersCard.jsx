import React from 'react'
import { Avatar,AvatarImage,AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Linkedin, Github, MessageCircle, GitBranch } from "lucide-react"

const UsersCard = ({user,visibleSkills,remainingCount}) => {
    return (
        <div  className="w-full md:w-[45%] lg:w-[30%] p-6 bg-card border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
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

                    {user.contactLinks?.discord && (
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <MessageCircle size={16} />
                        </Button>
                    )}

                    {user.contactLinks?.linkedIn && (
                        <Button size="sm" variant="outline" className="flex items-center gap-2 hover:bg-blue-600">
                            <Linkedin size={16} />
                        </Button>
                    )}

                    {user.contactLinks?.github && (
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Github size={16} />
                        </Button>
                    )}
                </div>
                <Button>Connect</Button>
            </div>
        </div>
    )
}

export default UsersCard