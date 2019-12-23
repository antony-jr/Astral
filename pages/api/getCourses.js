// Get all data to be displayed on the index like
// in MIT Stellar site.
// Enforces to use a specific format.
var getConnection = require("../../lib/getConnection.js");

export default (req, res) => {
  res.setHeader("Content-Type", "application/json");
  getConnection((err, con) => {
    if (err) {
      res.statusCode = 200;
      res.end(JSON.stringify({ error: true }));
      return;
    }

    con.query("SELECT * FROM Courses", (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ error: false, courses: results }));
      return;
    });
  });
};
