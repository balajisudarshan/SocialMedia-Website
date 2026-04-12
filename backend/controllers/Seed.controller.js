const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Project = require("../models/Project")

const techOptions = ["react", "node", "mongo", "express", "c#", "python"]
const visibilityOptions = ["public", "connections", "private"]

// generate random tech stack
const getRandomTech = () => {
  const shuffled = [...techOptions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
}

// generate unique project code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// generate project
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

// 🔥 MAIN SEED FUNCTION
const Seed = async (req, res) => {
  try {
    // 🛑 block in production
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not allowed in production" })
    }

    const { users, projectsPerUser = 5 } = req.body

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: "Users array required" })
    }

    const createdUsers = []

    for (const u of users) {
      let user = await User.findOne({ email: u.email })

      // ✅ CREATE USER (with hashing)
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

      createdUsers.push(user)

      // 🧹 OPTIONAL: clear old projects (prevents duplicates)
      await Project.deleteMany({ owner: user._id })

      // 🚀 CREATE PROJECTS
      const projects = []

      for (let i = 1; i <= projectsPerUser; i++) {
        projects.push(generateProject(i, user))
      }

      await Project.insertMany(projects)

      console.log(`📦 ${projectsPerUser} projects added for ${u.email}`)
    }

    return res.json({
      message: "Seeding completed successfully",
      totalUsers: createdUsers.length,
      projectsPerUser
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server error", error: err.message })
  }
}

module.exports = Seed