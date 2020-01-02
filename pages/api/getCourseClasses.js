import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const input = req.query.course
  const course = input.split('-')[0];
  const regulation = input.split('-R')[1];
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
        "SELECT * FROM ClassSites;",
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
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                error: false,
                data: []
              })
            );
            return;
          }

          const reqDatas = [];
          results.map((result, iteration) => {
            con.query(
              "SELECT * FROM Courses WHERE CourseID = '" +
                result["CourseID"] +
                "';",
              (e, r, f) => {
                if (e) {
                  con.release();
                  return;
		}

 
		      con.query("SELECT * FROM Users WHERE UserID='" + result["UserIncharge"] + "';", 
			      (E, R, F) => {
				      if(E){
					      con.release();
					      return;
				      }

				      if(course == r[0]["Course"] && regulation== r[0]["Regulation"]){
                let reqData = {
                  title: r[0]["SubjectCode"]+ " - Regulation " + r[0]["Regulation"] + ": " + r[0]["Title"],
		  instructor: result["Season"] + " " + result["Year"] + " / " + R[0]["LegalName"],
                  description: r[0]["Description"],
                  location: result["ClassPage"]
                };
					      reqDatas.push(reqData);
				      }

                // A little hackaround to avoid using the data before the map
                // finishes.
                if (iteration + 1 == results.length) {
                  con.release();
                  res.statusCode = 200;
                  res.end(JSON.stringify({ error: false, data: reqDatas }));
                  return;
		}
			      });
              }
            );
          });
        }
      );
    });
};

export default withSession(handler);
