import { withSession } from "next-session";
import siteConfig from "../../siteConfig.json";

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

  if (!req.session.userLogged) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: false,
        reason: "connection is not authenticated"
      })
    );
    return;
  }

  const { ClassID, MsgID } = req.body;

  if (typeof ClassID == "string" && typeof MsgID == "string") {
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
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
          }

          if (results.length == 0) {
            con.release();
            res.end(
              JSON.stringify({
                error: true,
                reason: "no such class"
              })
            );
          } else {
            if (results[0]["UserIncharge"] != req.session.username) {
              con.release();
              res.end(
                JSON.stringify({
                  error: true,
                  reason: "user not assigned to class"
                })
              );
              return;
            }

            con.query(
              "DELETE FROM `Announcements` WHERE MsgID = ? and ClassID = ?",
	      [MsgID, ClassID],
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
                res.end(JSON.stringify({ error: false, removal: "success" }));
                return;
              }
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
