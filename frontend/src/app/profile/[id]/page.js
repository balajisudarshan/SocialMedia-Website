"use client"
import React, { useState, useEffect, use } from "react"
import api from "@/lib/axios"

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

  if (!user) return (
    <div className="h-screen flex items-center justify-center text-zinc-400">
      Loading profile...
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600" />

      <div className="max-w-4xl mx-auto px-4">

        <div className="flex flex-col items-center -mt-16">

          <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center text-3xl font-bold">
            {user.userName?.charAt(0)}
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            {user.userName}
          </h1>

          <p className="text-zinc-400 text-sm">
            {user.firstName} {user.lastName}
          </p>

          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-semibold">{user.followers.length}</span> Followers
            </div>
            <div>
              <span className="font-semibold">{user.following.length}</span> Following
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

            {!user?.contactLinks?.github && !user?.contactLinks?.linkedIn && (
              <p className="text-zinc-500">No links available</p>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default Profile