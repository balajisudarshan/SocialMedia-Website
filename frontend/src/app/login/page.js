"use client"
import { useState } from "react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
export default function Login(){
  
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(true)
  const router = useRouter()
  const {fetchUser} = useAuth()
  async function handleLogin(e){
    e.preventDefault()
    try{
      await api.post("/auth/login",{
        email,
        password
      })
      await fetchUser()
      router.push("/")
      toast.success("Login Successfull")
    }catch(err){
      setError(err.response?.data?.message || "Login failed")
      toast.error(err.response?.data?.message)
    }finally{
      setLoading(false)
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

        <button className="bg-blue-600 text-white px-4 py-2 w-full" disabled={loading}>
          {loading?<Spinner/>:"Login"}
        </button>
      </form>
    </div>
  )
}