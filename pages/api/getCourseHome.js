import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var keys = []
  for (var i in req.query) {
	  keys.push(i);
  }

  if(keys.length != 1){
	  res.statusCode = 200;
	  res.end(JSON.stringify({error: true, reason: "invalid get query sent"}));
	  return;
  }
  const ClassID = keys[0];

  getConnection((err, con) => {
    if (err) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({ error: true, reason: "cannot connect to database" })
      );
      return;
    }
    con.query("SELECT * FROM ClassSites WHERE ClassID='" + ClassID + "';", (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
        return;
      }

      if (results.length == 0) {
        con.release();
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            error: true,
            reason: "no such class"
          })
        );
        return;
      }

      con.query(
          "SELECT * FROM Courses WHERE CourseID = '" + results["CourseID"] + "';",
          (e, r, f) => {
            if (e) {
              con.release();
	      res.statusCode = 200;
	      res.end(JSON.stringify({error: true, reason: "sql query failed"}));
	      return;
            }

            con.query(
              "SELECT * FROM Users WHERE UserID='" +
                result["UserIncharge"] +
                "';",
              (E, R, F) => {
                if (E) {
                  con.release();
                  return;
                }

                let reqData = {
                  title:
                    r[0]["SubjectCode"] +
                    " (" +
                    result["Season"] +
                    " / " +
                    result["Year"] +
                    ") " +
                    r[0]["Title"] +
                    " ",
                  instructor: R[0]["LegalName"],
                  location: result["ClassPage"]
                };

                  con.release();
                  res.statusCode = 200;
                  res.end(JSON.stringify({ error: false, data: reqDatas }));
                  return;
              });
          });
      });
    });
};

export default withSession(handler);
