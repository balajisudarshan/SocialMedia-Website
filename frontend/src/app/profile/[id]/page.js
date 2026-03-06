"use client"
import React, { useState, useEffect, use } from "react"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Profile = ({ params }) => {
  const { id } = use(params)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`)
        setUser(res.data.user)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [id])

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="sm:col-span-2 lg:col-span-2 hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-xl">{user.userName}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-sm leading-relaxed break-words">
              {user.bio}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {user.followers.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Following</CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {user.following.length}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-muted rounded-md text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Github</CardTitle>
          </CardHeader>

          <CardContent className="text-sm break-all">
            <a href={user.contactLinks.github} target="_blank">
              {user.contactLinks.github}
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LinkedIn</CardTitle>
          </CardHeader>

          <CardContent className="text-sm break-all">
            <a href={user.contactLinks.linkedIn} target="_blank">
              {user.contactLinks.linkedIn}
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Profile