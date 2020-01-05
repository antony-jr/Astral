import { withSession } from "next-session";
import siteConfig from "../../siteConfig.json";

var getConnection = require("../../lib/getConnection.js");
var crypto = require("crypto");
var generator = require("generate-password");
const sgMail = require("@sendgrid/mail");

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

  const { username, legalName, email } = req.body;

  if (
    typeof username == "string" &&
    typeof legalName == "string" &&
    typeof email == "string"
  ) {
    if (username.toLowerCase() == "administrator") {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          error: false,
          reason: "cannot create reserved username"
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
        "SELECT * FROM Users WHERE UserID='" + username + "';",
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
          var password = generator.generate({
            length: 14,
            numbers: true,
            symbols: true,
            uppercase: true,
            strict: true
          });
          const passwordHash = crypto
            .createHash("md5")
            .update(password)
            .digest("hex");

          if (results.length == 0) {
            // Implies there is not username collision.
            con.query(
              "INSERT INTO `Users` VALUES ('" +
                username +
                "', '" +
                email +
                "', '" +
                passwordHash +
                "', " +
                "'" +
                legalName +
                "');",
              (e, r, f) => {
                if (e) {
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({ error: true, reason: "sql query failed" })
                  );
                  return;
                }
                if (typeof process.env.SENDGRID_API_KEY == "undefined") {
                  console.log(
                    "[warning] Please set SENDGRID_API_KEY to send emails."
                  );
                } else {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const HTML = siteConfig["account-notice"]["email-body"]
                    .replace("<TEMPLATE>username</TEMPLATE>", username)
                    .replace("<TEMPLATE>password</TEMPLATE>", password);

                  const msg = {
                    to: email,
                    from: siteConfig["account-notice"]["email-from-address"],
                    subject: "Account Notice",
                    html: HTML
                  };
                  try {
                    sgMail.send(msg);
                  } catch (e) {
                    console.log("[error] Cannot send email.");
                  }
                }
                console.log(
                  "[info] Password for '" + username + "':" + password
                );
                res.statusCode = 200;
                con.release();
                res.end(JSON.stringify({ error: false, creation: "success" }));
                return;
              }
            );
          } else {
            con.release();
            res.end(
              JSON.stringify({
                error: false,
                creation: "failed",
                reason: "user already exists"
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
