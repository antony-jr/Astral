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
      "SELECT * FROM SiteConfig WHERE ValueKey='basicInfo';",
      (error, results, fields) => {
        if (error) {
          con.release();
          res.statusCode = 200;
          res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
          return;
        }

        res.statusCode = 200;
        if (results.length == 1) {
          try {
            con.release();
            const json = JSON.parse(results[0]["Value"]);
            res.end(JSON.stringify({ error: false, ...json }));
          } catch (e) {
            con.release();
            res.end(
              JSON.stirngify({ error: true, reason: "parsing json failed" })
            );
          }
        } else {
          con.release();
          res.end(JSON.stringify({ error: false, reason: "unknown" }));
        }
        return;
      }
    );
  });
};

export default withSession(handler);
