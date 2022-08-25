// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const axios = require("axios");


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

// Helper Functions
const { isolateVerb, isolateNoun } = require('./helper.js');

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/main", (req, res) => {
  db.query(`SELECT name FROM users WHERE id = $1;`, [
    req.cookies.username,
  ]).then((result) => {
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

app.post("/main", (req, res) => {
  // using encrypted cookies\

  const username = req.body.username;

  db.query(`SELECT * FROM users WHERE name = $1;`, [username]).then(
    (result) => {
      const id = result.rows[0].id;
      res.cookie("username", id).redirect("/main");
    }
  );
});

app.get("/reminder/json", (req, res) => {
  db.query(`SELECT * FROM lists_todo;`).then((result) => {
    const promiseArr = [];
    const imageData = [];
    console.log("This is result:", result);
    for (const item of result.rows) {
      const input = item.title;




      console.log("This is input:", input);
      const options = {
        method: "GET",
        url: `https://google-search3.p.rapidapi.com/api/v1/image/q=${input}`,
        headers: {
          "X-User-Agent": "desktop",
          "X-Proxy-Location": "EU",
          "X-RapidAPI-Key":
            "8f9fa3a9bemsh3da9a9c90adb9b5p1b07fajsn44bb79f22c85",
          "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
        },
      };

      promiseArr.push(axios.request(options));
    }
    Promise.all(promiseArr)
      .then((values) => {
        console.log(values);
        values.forEach((value, index) => {
          const item = result.rows[index];

          imageData.push({
            img: value.data.image_results[0].image.src,
            id: item.id,
            title: item.title,
            date: item.create_date,
          });
        });
        res.json(imageData);
      })
      .catch(function (error) {
        console.error(error);
      });

  });
});

app.post("/reminder/json", (req, res) => {
  const data = req.body.text;
  const categoryName = isolateVerb(data);
  db.query(`SELECT id FROM categories WHERE category_name = $1;`, [categoryName])
  .then((categoryId) => {
    db.query(
      `INSERT INTO lists_todo (title, user_id, category_id) VALUES ($1, $2, $3) RETURNING *;`,
      [data, req.cookies.username, categoryId]
    )
    .then((result) => {

    })
  });
////////////////
  // if (isolateVerb(data) === "watch") {
  //   db.query(`SELECT id FROM categories WHERE category_name = 'watch';`);

  // } else if (isolateVerb(data) === "visit") {
  //   db.query(`SELECT id FROM categories WHERE category_name = 'visit';`);

  // } else if (isolateVerb(data) === "read") {
  //   db.query(`SELECT id FROM categories WHERE category_name = 'read';`);

  // } else if (isolateVerb(data) === "buy") {
  //   db.query(`SELECT id FROM categories WHERE category_name = 'buy';`);
  // }
///////////////////

    .then((result) => {
      const options = {
        method: "GET",
        url: `https://google-search3.p.rapidapi.com/api/v1/image/q=${data}`,
        headers: {
          "X-User-Agent": "desktop",
          "X-Proxy-Location": "EU",
          "X-RapidAPI-Key":
            "8f9fa3a9bemsh3da9a9c90adb9b5p1b07fajsn44bb79f22c85",
          "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log("response", response.data.image_results[0].image.src);
          res.json({ img: response.data.image_results[0].image.src });
        })
        .catch(function (error) {
          console.error(error);
        });

      console.log(result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/register", (req, res) => {
  const name = req.body.username;
  const password = req.body.password;
  let id;
  db.query(`INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *;`, [
    name,
    password,
  ])
    .then((result) => {
      id = result.rows[0].id;
      res.cookie("username", id).redirect("/main");
    })

    .catch((err) => {
      console.log(err.message);
    });
});


// get/reminders this should return all the reminder for the user
// get/reminders/:reminder_id return and individual reminder and all of its information
// post/reminders/new create a new reminder and insert it into the database
// post/reminders/:reminder_id edit the reminder
// delete/reminders/:reminder_id delete the reminder

