"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

const MyProjects = () => {
  const [myProjects, setMyProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/project/my")
        setMyProjects(res.data.projects)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="p-6">
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {myProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No Projects Found
                </TableCell>
              </TableRow>
            ) : (
              myProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">
                    {project.projectName}
                  </TableCell>

                  <TableCell>
                    {project.projectCode}
                  </TableCell>

                  <TableCell className="capitalize">
                    {project.status}
                  </TableCell>

                  <TableCell>
                    {project.techStack.join(", ")}
                  </TableCell>

                  <TableCell className="capitalize">
                    {project.visibility}
                  </TableCell>

                  <TableCell>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default MyProjects