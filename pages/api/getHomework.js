import { withSession } from "next-session";

const mysql = require("mysql");

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
      "SELECT * FROM ClassSites WHERE ClassID = ?",
      [ClassID],
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
          "SELECT * FROM Users WHERE UserID = '" +
            results[0]["UserIncharge"] +
            "';",
          (e, r, f) => {
            if (e) {
              con.release();
              res.statusCode = 200;
              res.end(
                JSON.stringify({ error: false, reason: "sql query failed" })
              );
              return;
            }
            con.query(
              "SELECT HomeworkID,HomeworkTitle,Deadline,Author FROM Homeworks WHERE ClassID = " +
                mysql.escape(ClassID) +
                " ORDER BY HomeworkTimestamp DESC;",
              (E, R, F) => {
                if (E) {
                  con.release();
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({ error: true, reason: "sql query failed" })
                  );
                  return;
                }

                var showControl = false;
                if (
                  req.session.userLogged &&
                  req.session.username == results[0]["UserIncharge"]
                ) {
                  showControl = true;
                }
                const reqData = {
                  homeworks: R,
                  show_control: showControl
                };

                con.release();
                res.statusCode = 200;
                res.end(JSON.stringify({ error: false, ...reqData }));
                return;
              }
            );
          }
        );
      }
    );
  });
};

export default withSession(handler);
