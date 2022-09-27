const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs"); //ejs로 쓴 html을 node.js가 렌더링 해줌

// mongodb 연결
var db;
MongoClient.connect(
  "mongodb+srv://miso1489:miso1489@cluster0.3gpweno.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true }, //warning 메세지 제거
  function (err, client) {
    if (err) return console.log(err);

    //db = db(todoApp) 에 접속
    db = client.db("todoApp");

    //mongodb가 연결되면 서버 연결
    app.listen(8080, function () {
      console.log("📡 http://localhost:8080/ 로 서버 연결 됨 📡");
    });
  }
);

// __dirname : 현재 실행 중인 폴더 경로
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// 할 일 추가하는 페이지
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

// 할 일 보여주는 페이지
app.get("/list", function (req, res) {
  db.collection("post")
    .find() //find : 해당하는 자료 다 찾기
    .toArray(function (err, result) {
      //toArray() : 받은 자료를 배열화

      res.render("list.ejs", { posts: result });
      // result를 posts라는 이름으로 ejs에 보낸다.
    });
});

// 할 일 추가시 동작
app.post("/newpost", function (req, res) {
  // 기존 게시물 번호 불러와서 변수에 할당
  db.collection("counter").findOne(
    { name: "게시물 갯수" },
    function (err, result) {
      var count = result.totalPost;

      // 할 일 추가
      db.collection("post").insertOne(
        //post 라는 collection에 insertOne
        { _id: count + 1, 할일: req.body.title, 날짜: req.body.date },
        function (err, result) {
          // 게시물 번호 +1 업데이트
          db.collection("counter").updateOne(
            { name: "게시물 갯수" },
            { $inc: { totalPost: 1 } }, //$set => 수정, $inc => 증가
            function (err, result) {
              res.send("전송완료"); //화면에 '전송완료' 띄우기
            }
          );
        }
      );
    }
  );
});

//할 일 삭제
app.delete("/delete", function (req, res) {
  req.body._id = parseInt(req.body._id);
  console.log(req.body, "삭제");
  db.collection("post").deleteOne(req.body, function (err, result) {
    res.send("삭제 완료");
  });
});
