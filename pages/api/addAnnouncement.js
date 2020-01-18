import { withSession } from "next-session";
import siteConfig from "../../siteConfig.json";

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

  const { ClassID, Message } = req.body;

  if (typeof ClassID == "string" && typeof Message == "string") {
    getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }

      const timestamp = new Date().toString();
      const MessageID = crypto
        .createHash("md5")
        .update(ClassID + timestamp)
        .digest("hex");

      con.query(
        "SELECT * FROM ClassSites WHERE ClassID='" + ClassID + "';",
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
              "INSERT INTO `Announcements`(ClassID,MsgID,Msg,MsgTimestamp,Author) VALUES ('" +
                ClassID +
                "', '" +
                MessageID +
                "', '" +
                Message +
                "'," +
                "current_timestamp(), '" +
                req.session.legalName +
                "');",
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
                res.end(JSON.stringify({ error: false, addition: "success" }));
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
