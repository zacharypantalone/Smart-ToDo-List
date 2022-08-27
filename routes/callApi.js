const express = require("express");
const app = express.Router();
const axios = require("axios");
const { isolateVerb, isolateNoun } = require("../helper.js");
const { restart } = require("nodemon");

module.exports = (db) => {
  //**********************GET********************** */

  app.get("/", (req, res) => {
    db.query(`SELECT lists_todo.*, category_name FROM lists_todo INNER JOIN categories ON categories.id = category_id WHERE user_id = $1 ORDER BY create_date ASC;`, [
      req.cookies.username,
    ]).then((result) => {
      res.json({ message: "Here are your to-do's.", toDos: result.rows })

    });
  });

  //**********************POST********************** */
  app.post("/", (req, res) => {
    const data = req.body.text;
    const verb = isolateVerb(data).toLowerCase();
    const noun = isolateNoun(data);
    let argument = null;

    if (verb === "watch") argument = 1;
    else if (verb === "visit") argument = 2;
    else if (verb === "read") argument = 3;
    else if (verb === "buy") argument = 4;
    else argument = 5;

    const options = {
      method: "GET",
      url: `https://google-search3.p.rapidapi.com/api/v1/image/q=${noun}`,
      headers: {
        "X-User-Agent": "desktop",
        "X-Proxy-Location": "EU",
        "X-RapidAPI-Key":
          "c4cc5833bdmsh4beadf93e034785p129448jsnb00add367caf",
        "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        //  console.log("AQUIIIIIIII", response);
        //   console.log("response", response.data.image_results[0].image.src);
        const imageUrl = response.data.image_results[0].image.src;

        db.query(
          `INSERT INTO lists_todo (title, user_id, category_id, img_url) VALUES ($1, $2, $3, $4) RETURNING *;`,
          [data, req.cookies.username, argument, imageUrl]
        )
        .then((insertRes) => res.json({ message: "toDo succesfully created ", toDo: insertRes.rows[0]  }));
      })

      .catch((err) => {
        console.log(err.message);
      });
  });



  app.post("/delete/:id", (req, res) => {
    db.query(
      `DELETE FROM lists_todo WHERE id = $1;`,
      [req.params.id]
    ).then((result) => {
      res.redirect('/main');
    })
  });





  return app;
};


