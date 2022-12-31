const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
const port = 3000;

app.use(cookieParser())
app.use(express.json())

// 우리의 가상 db
const users = [
    {id: "noggong"},
    {id: "hyowon"},
    {id: "kimin"}
]

// 우리의 가상 세션 저장소
const sessions = []

app.get('/users', (req, res) => {
                                // ex)  [1, 2, 5, 6, 8, 1]이 있다면 0번째 인덱스의 값만 가져온다! 5번째 인덱스의 값을 가져오는 것이 아니라!
    const user = sessions.find // sessions 안에 있는 애들 중 밑에 있는 조건을 만족하는 애를 가져오겠다! (처음으로 맞는 친구만 가져오겠다. 그 뒤에 밑에 조건을 만족한 애는 가져오지 않음)
    (session =>  // 가상 세션 저장소에 있는 데이터 중 하나를 session 이라고 하고 (for of라고 생각하시면 될 것 같습니다.)
        session.ssid // session 안에 있는 ssid라는 키를 가진 친구의 val을 가져 오겟당! 그리고 그 친구와
        === req.cookies.ssid) // 쿠키중 ssid 라는 이름을 가진 친구의 val 과  같다면! 그 값을 user에 넣는다!

    console.log(user)
    res.send({id: user.id}) // 위에서 넣은 user의 값 예를 들자면 {id: "hyowon"}애서 "hyowon"이라는 값을 id라는 키를 가진 친구로 보내준다!
})

app.post('/login', (req, res) => {

    const userId = req.body.userId // 바디에서 입력받은 userId라는 친구를 userId에 할당

    const user = users.find // users 안에 있는 애들 중 밑에 있는 조건을 만족하는 애를 가져오겠다! (처음으로 맞는 친구만 가져오겠다. 그 뒤에 밑에 조건을 만족한 애는 가져오지 않음)
    (user => // 가상 db에 있는 데이터 중 하나를 user 이라고 하고 (for of라고 생각하시면 될 것 같습니다.)
        user.id // user 안에 있는 id라는 키를 가진 친구의 val을 가져 오겟당! 그리고 그 친구와
         === userId) // 쿠키중 ssid 라는 이름을 가진 친구의 val 과  같다면! 그 값을 user에 넣는다!

    const ssid = Date.now().toString() // ssid라는 친구한테 랜덤? 그냥 좀 긴 문자를 넣는다! Date.now()는 현재 초(숫자형), toString()은 Date.now()를 문자형으로 만들어준다!

    sessions.push({ // 가상 세션 저장소에 위에서 찾은 user와 ssid를 넣는다!
        ...user,
        ssid
    })

    console.log("로그인시 가상 세션 저장소에 추가 됩니다.",sessions)

    res.cookie("ssid", ssid) // "ssid"키를 가지고 ssid값을 가진 쿠키 맹그러

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