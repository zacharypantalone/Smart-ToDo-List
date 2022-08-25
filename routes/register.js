
// All routes for register are defined here

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

//**********************GET********************** */
  router.get("/", (req, res) => {
    res.render("register");
  });


//**********************POST********************** */
  router.post("/", (req, res) => {
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

  return router;
};
