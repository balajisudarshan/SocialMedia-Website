const axios = require("axios")

const BASE_URL = "http://localhost:5050"

const users = [
  { email: "elonmusk@gmail.com", password: "@balaji0" },
  { email: "stevejobs@gmail.com", password: "@balaji0" },
  { email: "markzuckerberg@gmail.com", password: "@balaji0" },
  { email: "jeffbezos@gmail.com", password: "@balaji0" },
  { email: "larrypage@gmail.com", password: "@balaji0" },
  { email: "sergeybrin@gmail.com", password: "@balaji0" },
  { email: "sundarpichai@gmail.com", password: "@balaji0" },
  { email: "satyanadella@gmail.com", password: "@balaji0" },
  { email: "timcook@gmail.com", password: "@balaji0" },
  { email: "jackma@gmail.com", password: "@balaji0" },
  { email: "warrenbuffett@gmail.com", password: "@balaji0" },
  { email: "mukeshambani@gmail.com", password: "@balaji0" },
  { email: "gautamadani@gmail.com", password: "@balaji0" },
  { email: "ratantata@gmail.com", password: "@balaji0" },
  { email: "billgates2@gmail.com", password: "@balaji0" }
]

const techOptions = ["react", "node", "mongo", "express", "c#", "python"]
const visibilityOptions = ["public", "connections", "private"]

// safer random (no mutation bug)
const getRandomTech = () => {
  const shuffled = [...techOptions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
}

const generateProject = (i) => {
  const tech = getRandomTech()

  return {
    projectName: `Project ${i}`,
    description: `Auto generated project ${i}`,
    techStack: tech,
    tags: tech,
    visibility: visibilityOptions[Math.floor(Math.random() * 3)]
  }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const run = async () => {
  for (const user of users) {
    try {
      console.log(`\n🔐 Logging in: ${user.email}`)

      // LOGIN
      const loginRes = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email: user.email,
          password: user.password
        }
      )

      console.log("LOGIN RESPONSE:", loginRes.data)

      const token =
        loginRes.data.token || loginRes.data.accessToken || loginRes.data.jwt

      if (!token) {
        console.log("❌ No token found. Check backend response.")
        continue
      }

      console.log(`✅ Logged in: ${user.email}`)

      // CREATE PROJECTS
      for (let i = 1; i <= 10; i++) {
        try {
          await axios.post(
            `${BASE_URL}/api/projects`,
            generateProject(i),
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          console.log(`   ➜ Project ${i} created`)
          await delay(100)

        } catch (projErr) {
          console.log(
            `   ❌ Project ${i} failed:`,
            projErr.response?.data || projErr.message
          )
        }
      }

      console.log(`🎉 Done for ${user.email}`)

    } catch (err) {
      console.log(`❌ Login failed for ${user.email}`)
      console.log(err.response?.data || err.message)
    }
  }

  console.log("\n🚀 All users processed")
}

run()