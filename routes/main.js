// All routes for main page are defined here

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //**********************GET********************** */
  router.get("/", (req, res) => {
    db.query(`SELECT name FROM users WHERE id = $1;`, [
      req.cookies.username,
    ]).then((result) => {
      const templateVars = { username: result.rows[0].name };

      res.render("main", templateVars);
    });
  });

  return router;
};

//**********************POST********************** */
