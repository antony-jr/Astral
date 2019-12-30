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

  if (req.session.userLogged) {
    res.statusCode = 200;
    res.end(JSON.stringify({ error: false, login: "success" }));
    return;
  }

  if (
    typeof req.body.username == "string" &&
    typeof req.body.password == "string"
  ) {
    getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }
      let hash = crypto
        .createHash("md5")
        .update(req.body.password)
        .digest("hex");
      con.query(
        "SELECT * FROM Users WHERE UserID='" +
          req.body.username +
          "' and PwdHash='" +
          hash +
          "';",
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
            // Implies successful login.
            req.session.userLogged = true;
            req.session.username = req.body.username;
            req.session.legalName = results[0]["LegalName"];
            res.end(JSON.stringify({ error: false, login: "success" }));
          } else {
            res.end(JSON.stringify({ error: false, login: "failed" }));
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
