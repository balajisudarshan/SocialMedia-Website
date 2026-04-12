const express = require("express")
const bcrypt = require("bcryptjs")

const User = require("../models/User.model")
const Project = require("../models/Project.model")

const router = express.Router()

// utils
const techOptions = ["react", "node", "mongo", "express", "c#", "python"]
const visibilityOptions = ["public", "connections", "private"]

const getRandomTech = () => {
  const shuffled = [...techOptions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
}

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const generateProject = (i, user) => {
  const tech = getRandomTech()

  return {
    projectName: `Project ${i} - ${user.userName}`,
    projectCode: generateCode(),
    description: `Auto generated project ${i}`,
    techStack: tech,
    tags: tech,
    owner: user._id,
    members: [],
    visibility: visibilityOptions[Math.floor(Math.random() * 3)]
  }
}

// 🔥 ROUTE + CONTROLLER IN SAME FILE
router.post("/", async (req, res) => {
  try {
    // safety check
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not allowed in production" })
    }

    const { users, projectsPerUser = 5 } = req.body

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: "Users array required" })
    }

    for (const u of users) {
      let user = await User.findOne({ email: u.email })

      // create user if not exists
      if (!user) {
        const hashed = await bcrypt.hash(u.password, 10)

        user = await User.create({
          userName: u.userName,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          password: hashed
        })

        console.log(`✅ Created user: ${u.email}`)
      } else {
        console.log(`✔️ User exists: ${u.email}`)
      }

      // clear old projects (optional)
      await Project.deleteMany({ owner: user._id })

      // create projects
      const projects = []
      for (let i = 1; i <= projectsPerUser; i++) {
        projects.push(generateProject(i, user))
      }

      await Project.insertMany(projects)

      console.log(`📦 ${projectsPerUser} projects added for ${u.email}`)
    }

    res.json({
      message: "Seeding completed",
      totalUsers: users.length,
      projectsPerUser
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router