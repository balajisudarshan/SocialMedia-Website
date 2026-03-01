"use client"
import { useState } from "react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

export default function Login(){

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const router = useRouter()

  async function handleLogin(e){
    e.preventDefault()
    try{
      await api.post("/auth/login",{
        email,
        password
      })
      router.push("/")
    }catch(err){
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return(
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  )
}