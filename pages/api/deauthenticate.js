import { withSession } from "next-session";

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
    req.session.destroy();
    res.statusCode = 200;
    res.end(JSON.stringify({ error: false, logout: "success" }));
    return;
  } else {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: true,
        reason: "you must authenticate in order to deauth"
      })
    );
    return;
  }
};

export default withSession(handler);
