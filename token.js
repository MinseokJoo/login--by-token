const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')  //  세션 사용하기 위한 패키지
const MemoryStore = require('memorystore')(session); // 세션 사용하기 위한 패키지
const crypto = require("crypto")

const app = express();
const port = 3000;

app.use(cookieParser())
app.use(express.json())

const ENCRYPTION_KEY = 'abcdefghijklmnop'.repeat(2)
const IV_LENGTH = 16

const sessionObj = {
    secret: 'kong', // 쿠키를 암호화할지 정해주는 옵션
    resave: false, //  세션값의 변동이 있든 없든 항상 세션을 다시 저장해줄지 정하는 옵션
    saveUninitialized: true, // 세션에 저장할 내용이 있든 없든 일단 저장할지 정하는 옵션
    store: new MemoryStore(), // 세션을 서버에 저장할때 사용하게될 저장소를 정하는 옵션
};

app.use(session(sessionObj)) // 세션을 sessionObj에서 설정한 옵션으로 사용한다는 것 같다!

// 암호화?
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
  )
  const encrypted = cipher.update(text)

  return (
      iv.toString('hex') +
      ':' +
      Buffer.concat([encrypted, cipher.final()]).toString('hex')
  )
}

//복호화?
function decrypt(text) {
  const textParts = text.split(":")
  const iv = Buffer.from(textParts.shift(), "hex")
  const encryptedText = Buffer.from(textParts.join(":"), "hex")
  const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
  )
  const decrypted = decipher.update(encryptedText)

  return Buffer.concat([decrypted,decipher.final()]).toString()
}

// 우리의 가상 db
const users = [
    {id: "noggong"},
    {id: "hyowon"},
    {id: "kimin"}
]

app.get('/users', (req, res) => {
  const token = req.cookies.userToken
  let userId
  try {
    userId = decrypt(token)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }

  const user = users.find(user => user.id === userId)
  
  res.send(user)
})

app.post('/login', (req, res) => {
  const userId = req.body.id
  const user = users.find(user => user.id === userId)

  if(!user) {
    return res.status(401).json({message: "눅웃에요?"})
  }
  const token = encrypt(user.id)
  res.cookie("userToken", token)
  console.log(req.cookies)

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