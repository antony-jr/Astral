import App from "../components/App.js";

import Typography from "@material-ui/core/Typography";

export default function() {
  let render = (
    <Typography variant="h4">Course Sites / Class Sites:</Typography>
  );
  return <App payload={render} />;
}
