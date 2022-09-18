const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs"); //ejs로 쓴 html을 node.js가 렌더링 해줌

// mongodb 연결
var db;
MongoClient.connect(
  "mongodb+srv://miso1489:miso1489@cluster0.3gpweno.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);

    db = client.db("todoApp");

    //listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
    app.listen(8080, function () {
      console.log("📡 서버 연결 됨 📡");
    });
  }
);

// __dirname : 현재 실행 중인 폴더 경로
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find() //find : 해당하는 자료 다 찾기
    .toArray(function (err, result) {
      //toArray : 받은 자료를 배열화
      console.log(result);

      res.render("list.ejs", { posts: result });
      //posts라는 배열을 만들고 result를 넣는다.
    });
});

app.post("/newpost", function (req, res) {
  res.send("전송완료"); //화면에 '전송완료' 띄우기
  console.log(req.body);

  db.collection("post").insertOne(
    //post 라는 collection에 insertOne
    { "할 일": req.body.title, 날짜: req.body.date },
    function (err, result) {
      console.log("저장완료");
    }
  );
});
