const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')  //  세션 사용하기 위한 패키지
const MemoryStore = require('memorystore')(session); // 세션 사용하기 위한 패키지

const app = express();
const port = 3000;

app.use(cookieParser())
app.use(express.json())

const sessionObj = {
    secret: 'kong', // 쿠키를 암호화할지 정해주는 옵션
    resave: false, //  세션값의 변동이 있든 없든 항상 세션을 다시 저장해줄지 정하는 옵션
    saveUninitialized: true, // 세션에 저장할 내용이 있든 없든 일단 저장할지 정하는 옵션
    store: new MemoryStore(), // 세션을 서버에 저장할때 사용하게될 저장소를 정하는 옵션
};

app.use(session(sessionObj)) // 세션을 sessionObj에서 설정한 옵션으로 사용한다는 것 같다!

// 우리의 가상 db
const users = [
    {id: "noggong"},
    {id: "hyowon"},
    {id: "kimin"}
]

app.get('/users', (req, res) => {
  const userId = req.session.userId // express-session을 다운 받으면 req.session으로 접근이 가능하다고 한다! / 너가 가진 세션중에 userId라는 친구의 값을 userId에 할당
  const user = users.find(user => user.id === userId) // cookie에서 봤을거라고 생각하고 생략~!
  
  if (!user) {
    return res.status(401).json({message: "로그인 이후 사용 가능한 기능입니다."})
  }

  res.send(user)
})

app.post('/login', (req, res) => {
  const userId = req.body.userId
  const user = users.find(user => user.id === userId)

  if(!user) {
    return res.status(401).json({message: "눅웃에요?"})
  }

  req.session.userId = user.id // user.id의 값을 session으로 userid라는 이름으로 저장한다.
  console.log(req.session)
  res.send(user.id)
})
app.post('/logout', (req, res) => {
  res.send("logout page")
})
app.post('/register', (req, res) => {
  res.send("register page")
})


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});