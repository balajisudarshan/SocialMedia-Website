"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SKILLS } from "@/constants/skills"
import { TAGS } from "@/constants/tags"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Page = () => {

  const router = useRouter()

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    status: "open",
    visibility: "connections"
  })

  const [techQuery, setTechQuery] = useState("")
  const [tagQuery, setTagQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const filteredTech = SKILLS.filter(skill =>
    skill.toLowerCase().includes(techQuery.toLowerCase()) &&
    !selectedTech.includes(skill)
  )

  const filteredTags = TAGS.filter(tag =>
    tag.toLowerCase().includes(tagQuery.toLowerCase()) &&
    !selectedTags.includes(tag)
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/project", {
      ...formData,
      techStack: selectedTech,
      tags: selectedTags
    })

    router.push("/")
    toast.success("Created Successfully")
    } catch (error) { 
      toast.error("error")
      console.log(error)
    }
    
  }

  return (
    <div className="min-h-screen px-6 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl space-y-10"
      >

        <h1 className="text-3xl font-bold text-center">
          Add a Project
        </h1>

        {/* Project Name */}
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="border"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="border"
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-3 relative">
          <Label>Tech Stack</Label>
          <Input
            placeholder="Search tech..."
            value={techQuery}
            onChange={(e) => setTechQuery(e.target.value)}
            className="border"
          />

          {techQuery && filteredTech.length > 0 && (
            <div className="absolute w-full mt-1 border rounded-md max-h-40 overflow-y-auto bg-background z-10">
              {filteredTech.map(skill => (
                <div
                  key={skill}
                  onClick={() => {
                    setSelectedTech([...selectedTech, skill])
                    setTechQuery("")
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-accent"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedTech.map(skill => (
              <Badge
                key={skill}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedTech(selectedTech.filter(s => s !== skill))
                }
              >
                {skill} ✕
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3 relative">
          <Label>Tags</Label>
          <Input
            placeholder="Search tags..."
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
            className="border"
          />

          {tagQuery && filteredTags.length > 0 && (
            <div className="absolute w-full mt-1 border rounded-md max-h-40 overflow-y-auto bg-background z-10">
              {filteredTags.map(tag => (
                <div
                  key={tag}
                  onClick={() => {
                    setSelectedTags([...selectedTags, tag])
                    setTagQuery("")
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-accent"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedTags(selectedTags.filter(t => t !== tag))
                }
              >
                {tag} ✕
              </Badge>
            ))}
          </div>
        </div>

        {/* Status & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-input rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-colors hover:bg-accent"
              >
                <option value="open">🟢 Open</option>
                <option value="close">🔴 Closed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Visibility</Label>
            <div className="relative">
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full appearance-none bg-background border border-input rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-colors hover:bg-accent"
              >
                <option value="public">🌐 Public</option>
                <option value="connections">🔗 Connections</option>
                <option value="private">🔒 Private</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Project
        </Button>

      </form>
    </div>
  )
}

export default Page