const isolateVerb = (verb) => {
  const verbResult = verb.split(" ")[0];
  return verbResult;
};

const isolateNoun = (noun) => {
  const negateVerb = noun.split(" ");
  negateVerb.shift();
  return negateVerb.join(" ");
};

console.log(isolateVerb("Watch Lord Of The Rings"));
console.log(isolateNoun("Watch Lord Of The Rings"));
/*
if (isolateVerb(data) === "watch") {
  db.query(`INSERT INTO lists_todo (category_id) VALUES (1) ;`);

} else if (isolateVerb(data) === "visit") {
  db.query(`INSERT INTO lists_todo (category_id) VALUES (2) ;`);

} else if (isolateVerb(data) === "read") {
  db.query(`INSERT INTO lists_todo (category_id) VALUES (3) ;`);


} else if (isolateVerb(data) === "buy") {
  db.query(`INSERT INTO lists_todo (category_id) VALUES (4) ;`);

};
*/
module.exports = { isolateVerb, isolateNoun };
