"use client"

import React from 'react'
import api from "@/lib/axios"
import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from 'next/link'
const page = () => {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])
  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await api.get('/project/', { params: { page, limit: 10 } })
        setProjects(prev => [...prev, ...res.data.projects])
        if (res.data.projects.length === 0) {
          setHasMore(false)
        }
        console.log(res.data.projects)
      } catch (error) {
        console.log(error)
      }
    }
    getProjects()
  }, [page])
  return (
    <div>
      <h1 className='text-3xl text-center py-10 underline underline-offset-4 font-bold mb-4'>Explore Projects</h1>
      <div className='flex flex-wrap gap-10 justify-center'>
        {projects.length === 0 ? <p className='text-center'>No projects found.</p> : projects.map(project => (
          <Link
            key={project._id}
            href={`/projects/view/${project._id}`}
            className="w-full md:w-[37%] lg:w-[30%] bg-card border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <ProjectCard project={project} user={user} />
          </Link>
        ))}

      </div>
      {hasMore ? (
        <div className='flex items-center justify-center my-5'>
          <button onClick={() => setPage(prev => prev + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Load More
          </button>
        </div>
      ):<p>No more projects to load.</p>}
    </div>
  )
}

export default page