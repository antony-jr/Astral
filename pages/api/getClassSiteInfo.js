import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var keys = [];
  for (var i in req.query) {
    keys.push(i);
  }

  if (keys.length != 1) {
    res.statusCode = 200;
    res.end(JSON.stringify({ error: true, reason: "invalid get query sent" }));
    return;
  }
  const ClassID = keys[0];

  getConnection((err, con) => {
    if (err) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({ error: true, reason: "cannot connect to database" })
      );
      return;
    }
    con.query(
      "SELECT * FROM ClassSites WHERE ClassID='" + ClassID + "';",
      (error, results, fields) => {
        if (error) {
          con.release();
          res.statusCode = 200;
          res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
          return;
        }

        if (results.length == 0) {
          con.release();
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              error: true,
              reason: "no such class"
            })
          );
          return;
        }

        con.query(
          "SELECT * FROM Courses WHERE CourseID = '" +
            results[0]["CourseID"] +
            "';",
          (e, r, f) => {
            if (e) {
              con.release();
              res.statusCode = 200;
              res.end(
                JSON.stringify({ error: true, reason: "sql query failed" })
              );
              return;
            }

            if (r.length == 0) {
              con.release();
              res.statusCode = 200;
              res.end(
                JSON.stringify({ error: true, reason: "no such course" })
              );
              return;
            }

            const reqData = {
              subject_code: r[0]["SubjectCode"],
              title: r[0]["Title"],
              regulation: r[0]["Regulation"],
              season: results[0]["Season"],
              year: results[0]["Year"],
              description: r[0]["Description"]
            };

            con.release();
            res.statusCode = 200;
            res.end(JSON.stringify({ error: false, ...reqData }));
            return;
          }
        );
      }
    );
  });
};

export default withSession(handler);
