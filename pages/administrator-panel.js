import App from "../components/App.js";
import axios from "axios";


import { Typography,
	 Container,
	 Divider,
	 Paper,
	 Chip,
         Grid } from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  userPageRoot: {
    ...theme.typography.button,
    backgroundColor: '#f44336',
    color: '#ffffff',
    padding: theme.spacing(1),
  }
}));

export default function (){
	const [session, setSession] = React.useState({userLogged: false, username: ''});
	React.useEffect(() => {
    axios
      .get(
	      "/api/getSession"
      )
      .then(({ data }) => {
	      setSession(data);
	      if(data.username != 'administrator'){
		      window.location.href = '/';
	      }
      });
  }, []);


	let render = null;
	if(session && session.userLogged && session.username == 'administrator'){
         render = (
	 <div>
		 <Typography variant="h4" >{session.legalName} / <b>Dashboard</b></Typography>
	 <Divider />
	 <br />
	 </div>
	 )
	}
	return <App userLogged={session.userLogged} username={session.username} payload={render} />
}
