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

  if (!req.session.userLogged) {
    res.statusCode = 200;
    res.end(JSON.stringify({ error: true, reason: "connection is not authenticated"}));
    return;
  }

  if (
    typeof req.body.fromAcademicYear == "string" &&
    typeof req.body.toAcademicYear == "string"
  ) {
    getConnection((err, con) => {
      if (err) {
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
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
          }

          res.statusCode = 200;
	  if (results.length == 1) {
	     con.query(
	       "UPDATE SiteConfig SET Value='" +
		     JSON.stringify(req.body) + "' WHERE ValueKey='basicInfo';",
		     (e,r,f) => {
		 if(e){
		       res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
       
		 }
	     res.end(JSON.stringify({ error: false, setAcademicYear: "success" }));
	     });	     
	 } else {
            res.end(JSON.stringify({ error: true, reason: "unknown" }));
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
