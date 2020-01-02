// Get only the course titles from the
// Courses table.
var getConnection = require("../../lib/getConnection.js");

export default (req, res) => {
  res.setHeader("Content-Type", "application/json");
  getConnection((err, con) => {
    if (err) {
      con.release();
      res.statusCode = 200;
      res.end(JSON.stringify({ error: true }));
      return;
    }

    con.query("SELECT * FROM AvalCourses", (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true }));
        return;
      }
      con.release();
      res.statusCode = 200;
      res.end(JSON.stringify({ error: false, titles: results }));
      return;
    });
  });
};
