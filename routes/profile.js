const express = require('express');
const router  = express.Router();

module.exports = (db) => {


//**********************GET********************** */
router.get("/", (req, res) => {

  db.query(`SELECT name FROM users WHERE id = $1;`, [
    req.cookies.username,
  ]).then((result) => {
    const templateVars = { username: result.rows[0].name };

    res.render("profile", templateVars);
  });



});







//**********************POST********************** */
router.post("/", (req, res) => {
  const name = req.body.username;
  const id = req.cookies.username;

  db.query(

 //   UPDATE users SET name = 'dudududu' WHERE id = 3

    `UPDATE users SET name = $1 WHERE id = $2 ;`, [name, id])

    .then((result) => {

      // const id = result.rows[0].name;
      // res.cookie("username", name).redirect("/main");
      res.redirect("/main");
    })


    .catch((err) => {
      console.log(err.message);
    });
});





  return router;
};
