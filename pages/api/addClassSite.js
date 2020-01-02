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

  const {CourseID, Year, Season, UserIncharge} = req.body;

  

  if (
	  typeof CourseID == "string" &&
	  typeof Year == "string" &&
	  typeof Season == "string" &&
	  typeof UserIncharge == "string"
  ) {
   getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }

     const ClassID = crypto
        .createHash("md5")
        .update(CourseID + Year + Season + UserIncharge)
        .digest("hex");

     const ClassPage = "/class/" + ClassID;

      con.query(
        "SELECT * FROM ClassSites WHERE ClassID='" +
          ClassID + "';",
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
            // Implies there is no class collision.
	    con.query(
		    "INSERT INTO `ClassSites` VALUES ('" + 
		    ClassID + "', '" + 
		    CourseID + "', '" + 
		    Year + "', '" + 
		    Season + "', '" + 
		    ClassPage + "', '" + 
		    UserIncharge + "');",
		    (e, r, f) => {
			    if (e) {
	    con.release();
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" }));
	    return;
	    } 
			    con.release();
		res.statusCode = 200;
		res.end(JSON.stringify({error: false, creation: "success"}));
		return;
	    
	    });
	  } else {
		  con.release();
            res.end(JSON.stringify({ error: false, creation: "failed", reason: "class already exists" }));
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
