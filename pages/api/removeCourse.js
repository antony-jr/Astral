import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");
var crypto = require("crypto");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method != "POST") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({ error: true, reason: "expected a post method request" })
    );
    return;
  }

  if (!req.session.userLogged || !req.session.username == "administrator") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: false,
        reason: "connection is not authenticated as the administrator"
      })
    );
    return;
  }

  const { course, regulation, subjectcode } = req.body;
  const CourseID = crypto
    .createHash("md5")
    .update(course + subjectcode + regulation)
    .digest("hex");

  if (
    typeof course == "string" &&
    typeof regulation == "string" &&
    typeof subjectcode == "string"
  ) {
    const CourseID = crypto
      .createHash("md5")
      .update(course + subjectcode + regulation)
      .digest("hex");
    getConnection((err, con) => {
      if (err) {
        con.release();
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }

      con.query(
        "SELECT * FROM Courses WHERE CourseID='" + CourseID + "';",
        (error, results, fields) => {
          if (error) {
            con.release();
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
          }

          res.statusCode = 200;
          if (results.length == 1) {
            con.query(
              "DELETE FROM Courses WHERE CourseID='" + CourseID + "';",
              (e, r, f) => {
                if (e) {
                  con.release();
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({ error: true, reason: "sql query failed" })
                  );
                  return;
                }
                con.release();
                res.statusCode = 200;
                res.end(JSON.stringify({ error: false, remove: "success" }));
                return;
              }
            );
          } else {
            con.release();
            res.end(
              JSON.stringify({
                error: false,
                remove: "failed",
                reason: "course does not exists"
              })
            );
          }
          return;
        }
      );
    });
  } else {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: true,
        reason: "invalid request body types, expected strings"
      })
    );
    return;
  }
};

export default withSession(handler);
