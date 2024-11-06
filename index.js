const cors = require("cors"); // 최상단에 있는 게 바람직
const express = require("express");
const app = express();
const port = 8000;

// 본문을 통해서 넘어온 요청을 파싱(변환) = 미들웨어(body-parser)를 이용해서 변환해 줘야 함
app.use(express.json()); // json 형식으로 변환 {"name" : "Alice", "age" : "25"}
app.use(express.urlencoded()); // json -> object { name : "Alice", age : "25" } 

var corsOptions = {
  // origin: 'http://localhost:3000/',
  origin: "*", // 모든 출처 허용
};

app.use(cors(corsOptions));

const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "react_bbs",
  password: "12345",
  database: "react_bbs",
});

db.connect(); // db와 연결

/*
// "/" 요청을 하면 두번째 인수(res)가 res.send('성공');을 클라이언트한테 보여 줌
app.get("/", (req, res) => {
  // ↓ sql을 변수에 담아서 사용
  const sql = "INSERT INTO requested (rowno) VALUES (1)";

  // query의 결과가 나오는 부분
  db.query(sql, (err, rows, fields) => {
    if (err) throw err;
    res.send("성공");
    console.log("데이터 추가 성공");
  });
});
*/

// "/list" 요청을 하면 두번째 인수(res)가 보드에 있는 모든 컬럼의 데이터를 가지고 와서 res.send(result);을 클라이언트한테 보여 줌
app.get("/list", (req, res) => { // req : 요청 res : 반응
  // ↓ sql을 변수에 담아서 사용
  const sql =
  "SELECT BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE , '%Y-%m-%d') AS REGISTER_DATE FROM board";
  
  // query의 결과가 나오는 부분
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/detail", (req, res) => { // req : 요청 res : 반응
  const id = req.query.id;
  // ↓ sql을 변수에 담아서 사용
  const sql =
  "SELECT BOARD_TITLE, BOARD_CONTENT FROM board WHERE BOARD_ID = ?";
  
  // query의 결과가 나오는 부분
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/insert', (req, res) => {
  console.log(req.body.title);
  let title =req.body.title;
  let content = req.body.content;
  /* const sql = "INSERT INTO board (BOARD_TITLE, BOARD_CONTENT, REGISTER_ID) VALUES (title, content, 'admin')"; */
  const sql = "INSERT INTO board (BOARD_TITLE, BOARD_CONTENT, REGISTER_ID) VALUES (?, ?, 'admin')";
  db.query(sql, [title, content], (err,result) => {
    res.send(result);
  })
})

app.post('/update', (req, res) => {
  /*
  console.log(req.body.title);
  let title =req.body.title;
  let content = req.body.content;
  let id = req.body.id;
  */
  const {id, title, content} = req.body;

  /* const sql = "UPDATE 테이블명 SET 컬럼=값, 컬럼=값 WHERE 컬럼명=값"; */
  const sql = "UPDATE board SET BOARD_TITLE = ?, BOARD_CONTENT = ? WHERE BOARD_ID = ?";
  db.query(sql, [title, content, id], (err,result) => {
    if (err) throw err;
    res.send(result);
  })
})

app.post('/delete', (req, res) => {

  // const boardIDList = req.body.boardIDList;
  const {boardIDList} = req.body;

  const sql = `DELETE FROM board WHERE BOARD_ID in (${boardIDList})`;
  db.query(sql, (err,result) => {
    if (err) throw err;
    res.send(result);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// db.end(); db와 연결 종료
