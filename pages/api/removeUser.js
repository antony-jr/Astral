import { withSession } from "next-session";
const mysql = require("mysql");

var getConnection = require("../../lib/getConnection.js");

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

  const { username } = req.body;

  if (typeof username == "string") {
    if (username.toLowerCase() == "administrator") {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          error: false,
          reason: "cannot delete reserved username"
        })
      );
      return;
    }

    getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }

      con.query(
        "SELECT * FROM Users WHERE UserID = ?",
	[username],
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
              "DELETE FROM Users WHERE UserID = ?",
		[username],
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
                reason: "user does not exists"
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
