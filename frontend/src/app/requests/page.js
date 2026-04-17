"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const Page = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchReq = async () => {
      try {
        const res = await api.get("/connection/getMyRequests")
        setRequests(res.data.requests)
        console.log("Requestes",res.data.requests)
      } catch (error) {
        console.log(error)
        toast.error("Failed to load requests")
      }
    }
    fetchReq()
  }, [])


 const manageRequest = async (type, id) => {
  setProcessingId(id)
  try {
    const result = await api.patch(`/connection/request/${id}/${type}`)
    console.log(result.data)
    toast.success(`Request ${type}ed successfully!`)
    setRequests(prev => prev.filter(req => req._id !== id))
  } catch (error) {
    console.error("Full error:", error)
    const message = error?.response?.data?.message || "Failed to manage request"
    const details = error?.response?.data?.error || error?.response?.data?.details || error?.message || ""
    const fullError = details ? `${message}: ${details}` : message
    console.error(fullError)
    toast.error(fullError)
  } finally {
    setProcessingId(null)
  }
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
              <div key={request._id} className="flex items-center justify-between p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition">

                <Link href={`/profile/${user._id}`} className="flex items-center gap-4">

                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-semibold text-lg">{user.userName}</h2>

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

                </Link>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    disabled={processingId === request._id}
                    onClick={() => manageRequest("reject", request._id)}
                  >
                    {processingId === request._id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Reject
                  </Button>

                  <Button
                    className="cursor-pointer"
                    disabled={processingId === request._id}
                    onClick={() => manageRequest("accept", request._id)}
                  >
                    {processingId === request._id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Accept
                  </Button>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Page