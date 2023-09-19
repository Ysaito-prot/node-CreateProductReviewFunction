const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "review",
  multipleStatements: true,
});

// cssファイルの取得
app.use(express.static("assets"));

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // 初期データ
  const sql = "SELECT * from personas;";

  // ソート用データ(ASC:昇順、DESC:降順)
  const asc = "SELECT * from personas ORDER BY rating ASC;";
  const desc = "SELECT * from personas ORDER BY rating DESC;";

  // 絞り込み用データ
  const rating5 = "SELECT * from personas WHERE rating = 5;";
  const rating4 = "SELECT * from personas WHERE rating = 4;";
  const rating3 = "SELECT * from personas WHERE rating = 3;";
  const rating2 = "SELECT * from personas WHERE rating = 2;";
  const rating1 = "SELECT * from personas WHERE rating = 1;";

  con.query(
    sql + asc + desc + rating5 + rating4 + rating3 + rating2 + rating1,
    function (err, result, fields) {
      if (err) throw err;
      res.render("index", {
        users: result[0],
        ratingASC: result[1],
        ratingDESC: result[2],
        rating5users: result[3],
        rating4users: result[4],
        rating3users: result[5],
        rating2users: result[6],
        rating1users: result[7],
      });
    }
  );
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO personas SET ?";

  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"));
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});

app.post("/update/:id", (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
