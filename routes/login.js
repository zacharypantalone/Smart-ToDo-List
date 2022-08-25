/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

//**********************GET********************** */
  router.get("/", (req, res) => {
    res.render("loginN");
  });


//**********************POST********************** */
  router.post("/", (req, res) => {

    const username = req.body.username;

    db.query(`SELECT * FROM users WHERE name = $1;`, [username])
    .then((result) => {
     
      if (result.rowCount !== 0) {
        const id = result.rows[0].id;
        res.cookie("username", id).redirect("main");
      } else {
        res.render("register");
      }
      }

    );
  })
  return router;
};
