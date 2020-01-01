import { withSession } from "next-session";
import siteConfig from '../../siteConfig.json';

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

  if (!req.session.userLogged || !req.session.username == 'administrator') {
    res.statusCode = 200;
    res.end(JSON.stringify({ error: false, reason: "connection is not authenticated as the administrator" }));
    return;
  }

  const {course, regulation, subjectcode, title, description} = req.body;

  

  if (
	  typeof course == "string" &&
	  typeof regulation == "string" &&
	  typeof subjectcode == "string" &&
	  typeof title == "string" &&
	  typeof description == "string"
  ) {
   getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }

     const CourseID = crypto
        .createHash("md5")
        .update(course + subjectcode + regulation)
        .digest("hex");
    
      con.query(
        "SELECT * FROM Courses WHERE CourseID='" +
          CourseID + "';",
        (error, results, fields) => {
          if (error) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
          }

	  if (results.length == 0) {
            // Implies there is no course collision.
	    con.query(
		    "INSERT INTO `Courses` VALUES ('" + 
		    CourseID + "', '" + 
		    course + "', '" + 
		    subjectcode + "', " + 
		    regulation + ", '" + 
		    title + "', '" + 
		    description + "', NULL);",
		    (e, r, f) => {
	    if (e) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" }));
	    return;
	    } 

		res.statusCode = 200;
		res.end(JSON.stringify({error: false, creation: "success"}));
		return;
	    
	    });
	  } else {
            res.end(JSON.stringify({ error: false, creation: "failed", reason: "user already exists" }));
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
