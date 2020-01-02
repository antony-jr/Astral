// Used to search all courses from the
// db.
var getConnection = require("../../lib/getConnection.js");

export default (req, res) => {
  res.setHeader("Content-Type", "application/json");
  getConnection((err, con) => {
    if (err) {
      res.statusCode = 200;
      res.end(JSON.stringify({ error: true, reason: "cannot connect to db"}));
      return;
    }

    con.query("SELECT CourseID FROM ClassSites", (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true, reason: "sql query failed" }));
        return;
      }
	    if(results.length == 0){
		    con.release();
	      res.statusCode = 200;
	      res.end(JSON.stringify({error: false, sites: []}));
	      return;
      }

      var reqData = []
      const uniqInsert = (arr, value) => {
	      if(arr.indexOf(value) == -1){
		      arr.push(value);
	      }
	      return;
      }
      results.map((result, iteration) => {
	   con.query("SELECT Course,Regulation FROM Courses WHERE CourseID='" + result["CourseID"] + "';",
		   (e, r, f) => {
			   if(e){
				   con.release();
				   res.statusCode = 200;
				   res.end(JSON.stringify({error: true, reason: "sql query failed"}));
				   return;
			   }
			   uniqInsert(reqData, r[0]["Course"] + "-R"  + r[0]["Regulation"]);
			   if(iteration + 1 == results.length){
				   con.release();
				   res.statusCode = 200;
				   res.end(JSON.stringify({error: false, sites: reqData}));
				   return;
			   }
	    });
      });
    });
  });
};
