const express = require("express")

const app = express()

app.use(express.json())

app.get("/users", (_,res) => {
  res.send("users page")
})

app.post("/login", (_,res) => {
  res.send("login page")
})

app.post("/logout", (_,res) => {
  res.send("logout page")
})

app.post("/register", (_,res) => {
  res.send("register page")
})

app.listen(3001, () => console.log(3001,"번 포트로 서버열림"))