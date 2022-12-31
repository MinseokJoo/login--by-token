const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json(), cookieParser())

app.get("/users", (req,res) => {
  const userId = req.cookies.userId

  console.log(userId)
  res.send("users page")
})

app.post("/login", (req,res) => {
  const {userId} = req.body
  res.send("login page")
})

app.post("/logout", (req,res) => {
  res.send("logout page")
})

app.post("/register", (req,res) => {
  res.send("register page")
})

app.listen(3001, () => console.log(3001,"번 포트로 서버열림"))