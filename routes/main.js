// All routes for main page are defined here

const { application } = require("express");
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

//**********************POST********************** */
router.post("/category", (req, res) => {
  db.query(`UPDATE lists_todo SET category_id = $1 WHERE id = $2;`, [req.body.category, req.body.id])
  .then(() => {
    res.send("okay");
  })
})


return router;
};
