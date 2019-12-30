import { withSession } from 'next-session';

var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if(req.method != 'GET'){
	  res.statusCode = 200;
	  res.end(JSON.stringify({error : true, reason: "expected a get method request"}));
	  return;
  }
  if(req.session.userLogged){
      getConnection((err, con) => {
      if (err) {
      res.statusCode = 200;
      res.end(JSON.stringify({ error: true, reason: "cannot connect to database"}));
      return;
      }
      con.query("SELECT * FROM ClassSites WHERE UserIncharge ='" 
		      + req.session.username + "';" , (error, results, fields) => {
      if (error) {
        con.release();
        res.statusCode = 200;
        res.end(JSON.stringify({ error: true, reason: "sql query failed"}));
        return;
      }
      

      if(results.length == 0){
	res.statusCode = 200;
	res.end(JSON.stringify({ error: true, reason: "no class for the administrator"}));
	return;
      }

      const reqDatas = []
      results.map((result, iteration) => {
	      con.query("SELECT * FROM Courses WHERE CourseID = '"+
		        result["CourseID"] + "';",
		(e, r, f) => {
		if (e) {
			return;
		}
		let reqData = {	
			title: r[0]["Title"],
			subjectCode: r[0]["SubjectCode"],
			season: result["Season"],
			desc: r[0]["Description"],
			location: result["ClassPage"]
		}
		reqDatas.push(reqData);

	        // A little hackaround to avoid using the data before the map
		// finishes.
		if(iteration+1 == results.length){
		      res.statusCode = 200;
		      res.end(JSON.stringify({error: false, classes: reqDatas}));		
		      return;
 
		}
	
		});
      });
    });
  });
  }else{
      res.statusCode = 200;
      res.end(JSON.stringify({error : true, reason: "connection is not authenticated"}));
      return;
  }
};

export default withSession(handler);