// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/main", (req, res) => {
  db.query(`SELECT name FROM users WHERE id = $1;`, [req.cookies.username])
    .then((result) => {
      const templateVars = { username: result.rows[0].name };

      res.render("main", templateVars);
    });


});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/register", (req, res) => {
  res.render("register");
});






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


app.post('/main', (req, res) => {
  // using encrypted cookies\

  const username = req.body.username;

  db.query(`SELECT * FROM users WHERE name = $1;`, [username])
    .then((result) =>  {

      const id = result.rows[0].id;
      res.cookie("username", id).redirect('/main');
    });


});


app.get('/reminder/json', (req, res) => {
  db.query(`SELECT * FROM lists_todo;`)
    .then((result) => {
      res.json(result.rows);
    });

});


app.post('/reminder/json', (req, res) => {
  const data = req.body.text;

  db.query(`INSERT INTO lists_todo (title, user_id) VALUES ($1, $2) RETURNING *;`, [data, req.cookies.username])
    .then((result) =>  {
      console.log(result.rows[0]);
      res.json(result.rows[0]);
    })

    .catch((err) => {
      console.log(err.message);
    });
});



app.post('/register', (req, res) => {
  const name = req.body.username;
  const password = req.body.password;
  let id;
  db.query(`INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *;`, [name, password])
    .then((result) =>  {

      id = result.rows[0].id;
      res.cookie("username", id).redirect('/main');
    })

    .catch((err) => {
      console.log(err.message);
    });


});


