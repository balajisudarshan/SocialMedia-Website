"use client"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
const useAuth = () => {
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                const res = await api.get('/auth/me')
                setUser(res.data)
            }catch(err){
                console.log(err)
                setUser(null)
            }
            finally{
                setLoading(false)
            }
        }
        fetchUser()
    },[])

  return {user,loading}
}

export default useAuth