import { withSession } from "next-session";

var getConnection = require("../../lib/getConnection.js");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method != "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({ error: true, reason: "expected a get method request" })
    );
    return;
  }

  if (req.session.userLogged) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: false,
        userLogged: req.session.userLogged,
        username: req.session.username,
        legalName: req.session.legalName
      })
    );
    return;
  } else {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: false,
        userLogged: false,
        username: "",
        legalName: ""
      })
    );
    return;
  }
};

export default withSession(handler);
