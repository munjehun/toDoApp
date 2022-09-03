const express = require("express");
const app = express();

//listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
app.listen(8080, function () {
  console.log("📡 서버 연결 됨 📡");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});
