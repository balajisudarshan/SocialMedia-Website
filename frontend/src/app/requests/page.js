"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Page = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchReq = async () => {
      try {
        const res = await api.get("/connection/getMyRequests")
        setRequests(res.data.requests)
        console.log(res.data.requests)
      } catch (error) {
        console.log(error)
      }
    }
    fetchReq()
  }, [])


  const manageRequest = (type, id) => {
    console.log(type)
    console.log(id)
  }
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Connection Requests
        </h1>

        {requests.length === 0 && (
          <p className="text-center text-muted-foreground">
            No requests found
          </p>
        )}

        <div className="flex flex-col gap-4">
          {requests.map((request) => {
            const user = request.sender

            return (
              <Link href={`/profile/${user._id}`} key={request._id}>
                <div
                  key={request._id}
                  className="flex items-center justify-between p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">

                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="font-semibold text-lg">
                        {user.userName}
                      </h2>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {user.bio}
                      </p>

                      <div className="flex gap-2 mt-1 flex-wrap">
                        {user.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-1 bg-zinc-800 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className='cursor-pointer' onClick={() => manageRequest('accept', request._id)}>
                      Reject
                    </Button>

                    <Button className='cursor-pointer'>
                      Accept
                    </Button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Page