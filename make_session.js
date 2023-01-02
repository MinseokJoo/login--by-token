const express = require("express")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const store = require("memorystore")(session)

const app = express()

app.use(express.json(), cookieParser())

const sessionObj = {
  secret: "minseok",
  store: new store(),
  resave: false,
  saveUninitialized: true
}

app.use(session(sessionObj))

const users = [
  {id: "noggong"},
  {id: "hyowon"},
  {id: "kimin"}
]

app.get("/users", (req,res) => {
  const userId = req.session.userId

  const user = users.find(user => userId === user.id)

  if(!user) {
    return res.status(401).json({message: "로그인 이후에 사용 가능한 기능입니다."})
  }

  res.send(user)
})

app.post("/login", (req,res) => {
  const {userId} = req.body

  const user = users.find(user => user.id === userId)

  if(!user) {
    return res.status(401).json({message: "없는 아이디입니다아아아아아아"})
  }

  req.session.userId = user.id
  console.log(req.session)
  res.send(user.id)
})

app.post("/logout", (req,res) => {
  res.send("logout page")
})

app.post("/register", (req,res) => {
  res.send("register page")
})

app.listen(3001, () => console.log(3001,"번 포트로 서버열림"))