"use client"
import React, { useEffect, useState } from 'react'
import { use } from 'react'
import api from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Pencil, Trash2, ArrowLeft, User2Icon } from 'lucide-react'
import { Users } from 'lucide-react'
const Page = ({ params }) => {
  const { id } = use(params)
  const [projectDetails, setProjectDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/project/${id}`)
        setProjectDetails(res.data)
        console.log(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  const statusColor = statusColors[projectDetails.status?.toLowerCase()] ?? statusColors.inactive

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="border-b border-zinc-800/60 px-6 py-4">
        <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header card */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-8 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {projectDetails.projectName ?? 'View Project'}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                  {projectDetails.status}
                </span>
              </div>

              <div className="flex items-center gap-5 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <User className="w-3.5 h-3.5" />
                  {projectDetails.owner.userName}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(projectDetails.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>

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
          </div>
        </div>

        {/* Content area */}
        <div className='flex gap-10 flex-col lg:flex-row md:flex-row'>
          <div className="flex-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm  min-h-64 ">
            <div className='flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60'>
              <h2>Project Details</h2>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300 p-3 flex flex-col gap-3">
              <li className=' text-muted-foreground'>Project Code : <span className='text-white'>{projectDetails.projectCode}</span></li>
              <li className=' text-muted-foreground'>Status : <span className='text-white'>{projectDetails.status}</span></li>
              <li className=' text-muted-foreground'>Visibility : <span className='text-white'>{projectDetails.visibility}</span></li>
              <li className=' text-muted-foreground'>Tech Stack : <span className='text-white'>{projectDetails.techStack.join(' , ')}</span></li>
              <li className=' text-muted-foreground'>Tags : <span className='text-white'>{projectDetails.tags.join(' , ')}</span></li>
            </ul>
          </div>
          <div className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm min-h-64">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
              <Users className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-white tracking-wide">Members</h2>
            </div>
            <div className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {projectDetails.members.length > 0 ?projectDetails.members.map((member) => (
                <div
                  key={member._id}
                  className="flex gap-3 p-3 bg-zinc-900 hover:bg-zinc-800 transition"
                >
                  <User2Icon className="w-4 h-4 text-zinc-400" />
                  <h1 className="text-sm text-zinc-300">{member.name}</h1>
                </div>
              )):"No members"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page