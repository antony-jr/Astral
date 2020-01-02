var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  getConnection((err, con) => {
    if (err) {
	 con.release();
	    res.statusCode = 200;
      res.end(JSON.stringify({ error: true, reason: "cannot connect to database" }));
      return;
    }

    con.query("SELECT * FROM Courses", (error, results, fields) => {
	    if (error) {
		    con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
        return;
      }
con.release();
      res.statusCode = 200;
      res.end(JSON.stringify({ error: false, courses: results }));
      return;
    });
  });
};

export default handler;
