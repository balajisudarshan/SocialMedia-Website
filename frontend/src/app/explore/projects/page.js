"use client"

import React from 'react'
import api from "@/lib/axios"
import { useState,useEffect } from 'react'
const page = () => {
  const [projects,setProjects] = useState([])
  useEffect(()=>{
    const getProjects = async()=>{
      try {
        const res = await api.get('/project/',{params:{page:1,limit:10}})
        setProjects(res.data.projects)
        console.log(res.data.projects)
      } catch (error) {
        console.log(error)
      }
    }
    getProjects()
  },[])
  return (
    <div>Explore</div>
  )
}

export default page