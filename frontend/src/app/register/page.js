"use client"

import { useState, useRef, useEffect } from "react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { SKILLS } from "@/constants/skills"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
    contactLinks: {
      github: "",
      linkedIn: "",
      discord: ""
    }
  })

  const [query, setQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [error, setError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading,setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { fetchUser } = useAuth()

  const filteredSkills = SKILLS.filter(skill =>
    skill.toLowerCase().includes(query.toLowerCase()) &&
    !selectedSkills.includes(skill)
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContactChange = (e) => {
    setFormData({
      ...formData,
      contactLinks: { ...formData.contactLinks, [e.target.name]: e.target.value }
    })
  }

  async function handleRegister(e) {
    e.preventDefault()
    try {
      await api.post("/auth/register", { ...formData, skills: selectedSkills })
      await fetchUser()
      toast.success("Registered Successfully")
      router.push("/login")

    } catch (err) {
      setError(err.response?.data?.message || "Register failed")
      toast.error(err.response?.data?.message)
    }finally{
        setLoading(false)
    }
  }
  
  return (
    
    <div className="flex justify-center items-center min-h-screen px-6 bg-background">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the community. Fill in your details below.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Section: Identity */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Identity
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  name="firstName"
                  placeholder=" "
                  onChange={handleChange}
                  className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
                />
                <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  First Name
                </label>
              </div>
              <div className="relative">
                <input
                  name="lastName"
                  placeholder=" "
                  onChange={handleChange}
                  className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
                />
                <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                name="userName"
                placeholder=" "
                onChange={handleChange}
                className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
              />
              <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                Username
              </label>
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section: Auth */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Account
            </legend>

            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder=" "
                onChange={handleChange}
                className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
              />
              <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder=" "
                onChange={handleChange}
                className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
              />
              <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                Password
              </label>
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section: Profile */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Profile
            </legend>

            <div className="relative">
              <textarea
                name="bio"
                placeholder=" "
                onChange={handleChange}
                rows={3}
                className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none resize-none focus:border-foreground transition placeholder-transparent"
              />
              <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                Short Bio
              </label>
            </div>

            {/* Skill Selector */}
            <div ref={dropdownRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setDropdownOpen(true)
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  className="peer w-full border border-border rounded-lg px-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
                />
                <label className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  Search skills...
                </label>
              </div>

              {dropdownOpen && query && filteredSkills.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-44 overflow-y-auto border border-border rounded-lg bg-background shadow-lg text-sm">
                  {filteredSkills.map(skill => (
                    <div
                      key={skill}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setSelectedSkills([...selectedSkills, skill])
                        setQuery("")
                        setDropdownOpen(false)
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer text-xs px-2 py-1 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors gap-1"
                    onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                  >
                    {skill}
                    <span className="opacity-60 text-[10px]">✕</span>
                  </Badge>
                ))}
              </div>
            )}
          </fieldset>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section: Contact */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Contact Links
            </legend>

            {[
              { name: "github", label: "GitHub URL", icon: "⌥" },
              { name: "linkedIn", label: "LinkedIn URL", icon: "in" },
              { name: "discord", label: "Discord Username", icon: "#" }
            ].map(({ name, label, icon }) => (
              <div key={name} className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground font-mono select-none">
                  {icon}
                </span>
                <input
                  name={name}
                  placeholder=" "
                  onChange={handleContactChange}
                  className="peer w-full border border-border rounded-lg pl-8 pr-3 pt-5 pb-2 text-sm bg-background text-foreground outline-none focus:border-foreground transition placeholder-transparent"
                />
                <label className="absolute left-8 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  {label}
                </label>
              </div>
            ))}
          </fieldset>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg border border-foreground bg-foreground text-background text-sm font-medium hover:bg-background hover:text-foreground transition-colors duration-200"
            disabled={loading}
          >
            {loading?<Spinner/>:"Create Account"}
          </button>

          <p className="text-center text-xs text-muted-foreground pb-6">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Sign in
            </a>
          </p>

        </form>
      </div>
    </div>
  )
}