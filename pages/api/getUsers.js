import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");
var crypto = require("crypto");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method != "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({ error: true, reason: "expected a get method request" })
    );
    return;
  }
  if (!req.session.userLogged || req.session.username != "administrator") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({ error: true, reason: "connection is not authenticated" })
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
      "SELECT LegalName,UserID,EmailID FROM Users WHERE UserID != 'administrator';",
      (error, results, fields) => {
        if (error) {
          con.release();
          res.statusCode = 200;
          res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
          return;
        }
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: false, users: results }));
        return;
      }
    );
  });
};

export default withSession(handler);
