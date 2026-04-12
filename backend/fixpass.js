const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const User = require("./models/User.model")

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const users = await User.find()

  for (const user of users) {
    // only hash if not already hashed
    if (!user?.password?.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.password, 10)
      user.password = hashed
      await user.save()
    }
  }

  console.log("Users fixed. Your login can breathe now.")
  process.exit()
}

run()