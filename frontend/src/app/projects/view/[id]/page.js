"use client"
import React, { useEffect, useState } from 'react'
import { use } from 'react'
import api from '@/lib/axios'

const Page = ({ params }) => {
  const { id } = use(params)  // ✅ use() for client components
  const [projectDetails, setProjectDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/project/${id}`)
        console.log(res)
        setProjectDetails(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id]) 

  if (loading) return <div>Loading...</div>

  return (
    <div>{id}</div>
  )
}

export default Page