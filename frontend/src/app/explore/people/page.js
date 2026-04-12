"use client"
import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { Eye, Plus } from 'lucide-react'


const page = () => {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const res = await api.get("/user?limit=6")
      setUsers(res.data.users)
      console.log(res.data.users)
    } catch (error) {
      console.log(error)
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className='max-w-3xl mx-auto px-4'>
        <h1 className="text-3xl font-semibold text-center mb-12 tracking-tight text-white">
          Explore Users
        </h1>

        <div className="flex flex-col  gap-4">
          {usersLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
              <p className="text-sm text-zinc-500 tracking-wide">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-zinc-500">No users found.</p>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                className="w-full bg-gradient-to-r from-zinc-900 to-zinc-900/70 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30 transition-all duration-200"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold border border-zinc-700">
                    {user.userName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white tracking-tight">
                      {user.userName}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>
                <div className='flex flex-row gap-3'>
                  {/* RIGHT */}
                  <button className="text-xs px-4 py-1.5 rounded-md bg-zinc-800 text-white border border-zinc-700 hover:bg-white hover:text-black transition-all duration-200">
                    <Plus size={16}/>
                  </button>
                  <button className="text-xs px-4 py-1.5 rounded-md bg-zinc-800 text-white border border-zinc-700 hover:bg-white hover:text-black transition-all duration-200">
                    <Eye size={16}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default page