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
    if (
    typeof req.body.oldPassword == "string" &&
    typeof req.body.newPassword == "string"
    ) {
    getConnection((err, con) => {
      if (err) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ error: true, reason: "cannot connect to database" })
        );
        return;
      }
      const hash = crypto
        .createHash("md5")
        .update(req.body.oldPassword)
	.digest("hex");
      const newHash = crypto
	.createHash("md5")
	.update(req.body.newPassword)
	.digest("hex");

      con.query(
        "UPDATE Users SET PwdHash='" + newHash + "' WHERE UserID='" +
          req.session.username +
          "' and PwdHash='" +
          hash +
	  "';",
          (error, results, fields) => {
          if (error) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
            return;
          }

          con.query("SELECT * FROM Users WHERE UserID='" 
	  + req.session.username + 
		  "' and PwdHash='" + newHash + "';", (e, r, f) => {
			  if(e){
	     res.statusCode = 200;
            res.end(
              JSON.stringify({ error: true, reason: "sql query failed" })
            );
        	  
		  return;
	  }
			  
	  res.statusCode = 200;
          if (r.length == 1) {
            // Implies successful passsword change.
            res.end(JSON.stringify({ error: false, passwordChange: "success" }));
          } else {
            res.end(JSON.stringify({ error: false, passwordChange: "failed" }));
	  }
		  });
          return;
        }
      );
    });
 
    }else{
	    res.statusCode = 200;
	    res.end(JSON.stringify({error: true, reason: "expected string in post body values"}));
    }
    return;
  }else{
    res.statusCode = 200;
    res.end(JSON.stringify({error: true, reason: "the connection needs to be authenticated."}));
    return;
  }
};

export default withSession(handler);
