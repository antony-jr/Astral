var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  getConnection((err, con) => {
    if (err) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({ error: true, reason: "cannot connect to database" })
      );
      return;
    }

    con.query("SELECT * FROM ClassSites;", (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
        return;
      }

      var errored = false;
      var datas = [];

      if (results.length == 0) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: false, classes: [] }));
        return;
      }
      results.map((entry, iteration) => {
        con.query(
          "SELECT * FROM Courses WHERE CourseID='" + entry["CourseID"] + "';",
          (e, r, f) => {
            if (errored) {
              return;
            }
            if (e) {
              con.release();
              errored = true;
              res.statusCode = 200;
              res.end(
                JSON.stringify({ error: true, reason: "sql query failed" })
              );
              return;
            }
            console.log(r);
            datas.push({
              ClassID: entry["ClassID"],
              CourseID: entry["CourseID"],
              SubjectCode: r[0]["SubjectCode"],
              Regulation: r[0]["Regulation"],
              Title: r[0]["Title"],
              Year: entry["Year"],
              Season: entry["Season"],
              UserIncharge: entry["UserIncharge"]
            });
            if (iteration + 1 == results.length) {
              con.release();
              res.statusCode = 200;
              res.end(JSON.stringify({ error: false, classes: datas }));
              return;
            }
          }
        );
      });
    });
  });
};

export default handler;
