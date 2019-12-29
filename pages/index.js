import App from "../components/App.js";

import { Typography,
	 Container,
	 Divider,
	 Paper,
         Chip} from "@material-ui/core";

export default function() {
  let render = (
	  <div>
	  <Typography variant="h4">Class Sites / <b>2020 - 2021</b></Typography>
	  <Divider />
	  <br />
	  <Paper style={{minHeight: '100px'}}>
	  <br/>
	  <div style={{marginLeft: '10%'}}>
		  <Chip
                label="CSE-R17"
        clickable
        color="secondary"
/>
</div>
	  </Paper>
	  </div>
  );
  return <App payload={render} />;
}
