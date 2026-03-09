"use client"
import React, { useEffect, useState } from "react"
import { use } from "react"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Pencil, Trash2, ArrowLeft, User2Icon, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const Page = ({ params }) => {
  const { user } = useAuth()
  const { id } = use(params)

  const [project, setProject] = useState(null)
  const [requestStatus, setRequestStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const fetchProject = async () => {
    const res = await api.get(`/project/${id}`)
    setProject(res.data)
  }

  const fetchRequestStatus = async () => {
    const res = await api.get(`/project/status/${id}`)
    setRequestStatus(res.data.status)
  }
  const getProjectRequests = async () => {
    try {
      const res = await api.get(`/project/${id}/requests`)
      console.log("Project requests:", res.data.projectRequests)
      setRequests(res.data?.projectRequests)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProject(),
          fetchRequestStatus(),
          getProjectRequests()
        ])
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const isOwner =
    project?.owner?._id?.toString() === user?.user?._id?.toString()

  const sendProjectRequest = async () => {
    try {
      const res = await api.post(`/project/request/${id}`)
      console.log(res.data)
      setRequestStatus("pending")
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    )
  }

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  }

  const statusColor =
    statusColors[project.status?.toLowerCase()] ?? statusColors.inactive

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="border-b border-zinc-800/60 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-8 mb-8">
          <div className="flex items-start justify-between gap-4">

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {project.projectName}
                </h1>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="flex items-center gap-5 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <User className="w-3.5 h-3.5" />
                  {project.owner.userName}
                </span>

                <span className="text-zinc-700">·</span>

                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isOwner ? (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white gap-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            ) : requestStatus === "pending" ? (
              <Badge variant="outline" className="px-3 py-1 text-xs">
                Request Sent
              </Badge>
            ) : (
              <Button size="sm" onClick={sendProjectRequest}>
                Request to Join
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-10 flex-col lg:flex-row md:flex-row">

          <div className="flex-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm min-h-64">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
              <h2>Project Details</h2>
            </div>

            <ul className="list-disc list-inside text-sm text-zinc-300 p-3 flex flex-col gap-3">
              <li className="text-muted-foreground">
                Project Code :
                <span className="text-white"> {project.projectCode}</span>
              </li>

              <li className="text-muted-foreground">
                Status :
                <span className="text-white"> {project.status}</span>
              </li>

              <li className="text-muted-foreground">
                Visibility :
                <span className="text-white"> {project.visibility}</span>
              </li>

              <li className="text-muted-foreground">
                Tech Stack :
                <span className="text-white">
                  {" "}
                  {project.techStack.join(", ")}
                </span>
              </li>

              <li className="text-muted-foreground">
                Tags :
                <span className="text-white">
                  {" "}
                  {project.tags.join(", ")}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm min-h-64">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
              <Users className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Members
              </h2>
            </div>

            <div className="overflow-y-auto max-h-64">
              {project.members.length > 0
                ? project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 transition"
                  >
                    <User2Icon className="w h-4 text-zinc-400" />
                    <h1 className="text-sm text-zinc-300">{member.name}</h1>
                  </div>
                ))
                : "No members"}
            </div>
          </div>

        </div>
        {isOwner && (
          <div className="flex-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm min-h-64 mt-10">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
              <h2 className="text-md font-semibold text-white tracking-wide">
                Requests
              </h2>
            </div>
            <div>
              <div>
                {requests.length === 0 && (
                  <p className="text-center text-muted-foreground p-5">
                    No requests foreground
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  {requests.map((request) => {
                    return (
                      <div className="p-3">
                        <div className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 transition rounded-xl p-4 border border-zinc-800">

                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request?.requester?.avatar} />
                              <AvatarFallback>
                                {request?.requester?.userName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                              <h2 className="font-semibold text-white">
                                {request?.requester?.userName}
                              </h2>
                              <p className="text-sm text-zinc-400 max-w-md">
                                {request?.requester?.bio}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Accept
                            </Button>
                            <Button variant="outline" className="border-red-800 text-red-400 hover:bg-red-900/30">
                              Reject
                            </Button>
                          </div>

                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  )
}

export default Page