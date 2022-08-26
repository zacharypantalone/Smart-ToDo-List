const express = require("express");
const app = express.Router();
const axios = require("axios");
const { isolateVerb, isolateNoun } = require("../helper.js");
const { restart } = require("nodemon");

module.exports = (db) => {
  //**********************GET********************** */

  app.get("/", (req, res) => {
    db.query(`SELECT * FROM lists_todo WHERE user_id = $1;`, [
      req.cookies.username,
    ]).then((result) => {
      res.json({ message: "Here are your to-do's.", toDos: result.rows })
      // const promiseArr = [];
      // const imageData = [];
      // //  console.log("This is result:", result);
      // for (const item of result.rows) {
      //   const input = isolateNoun(item.title);

      //   //      console.log("This is input:", input);
      //   const options = {
      //     method: "GET",
      //     url: `https://google-search3.p.rapidapi.com/api/v1/image/q=${input}`,
      //     headers: {
      //       "X-User-Agent": "desktop",
      //       "X-Proxy-Location": "EU",
      //       "X-RapidAPI-Key":
      //         "c4cc5833bdmsh4beadf93e034785p129448jsnb00add367caf",
      //       "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
      //     },
      //   };
      //   promiseArr.push(axios.request(options));
      // }
      // Promise.all(promiseArr)
      //   .then((values) => {
      //     // console.log(values);
      //     values.forEach((value, index) => {
      //       const item = result.rows[index];

      //       imageData.push({
      //         img: value.data.image_results[0].image.src,
      //         id: item.id,
      //         title: item.title,
      //         date: item.create_date,
      //       });
      //     });
      //     res.json(imageData);
      //   })
      //   .catch(function (error) {
      //     console.error(error);
      //   });
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

    // const displayCategory = (verb) => {
    //   return `${verb} ToDo List`;
    // };

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


