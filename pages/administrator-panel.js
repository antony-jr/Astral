import App from "../components/App.js";
import ControlPanel from '../components/ControlPanel.js';
import axios from "axios";

import {
  Typography,
  Container,
  Divider,
  Paper,
  Chip,
  Grid,
  Button
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

// Component for each control panel
import GeneralSettings from '../components/GeneralSettings.js'; 
import UserSettings from '../components/UserSettings.js';
import CourseSettings from '../components/CourseSettings.js';
import ClassSitesSettings from '../components/ClassSitesSettings.js';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

export default function() {
  const classes = useStyles();	
  const [currentContent, setCurrentContent] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [session, setSession] = React.useState({
    userLogged: false,
    username: ""
  });
  React.useEffect(() => {
    axios.get("/api/getSession").then(({ data }) => {
      setSession(data);
      if (data.username != "administrator") {
        window.location.href = "/";
      }
    });
  }, []);

  const handleChange = panel => (e, isExpanded) => {
	var content  = null;  
	if(isExpanded){  
	switch(panel){
		case 'generalSettings':
			content = (<GeneralSettings />);
			break;
		case 'userSettings':
			content = (<UserSettings />);
			break;
		case 'courseSettings':
			content = (<CourseSettings />);
			break;
		case 'classSitesSettings':
			content = (<ClassSitesSettings />);
			break;
		default:
			content = (null);
			break;
	}
	}else{
		content = null;
	}
	setExpanded(isExpanded ? panel : false);
	setCurrentContent(content);
  };

  let render = null;
  if (session && session.userLogged && session.username == "administrator") {
    render = (
      <div>
        <Typography variant="h4">
          {session.legalName} / <b>Dashboard</b>
        </Typography>
	<Divider />
	<br />
	<div className={classes.root}>
		<ControlPanel 
		    heading="General Settings"
		    expanded={expanded == 'generalSettings'}
		    onChange={handleChange('generalSettings')}
		    payload={currentContent}/>

	       		<ControlPanel 
		    heading="User Settings"
		    expanded={expanded == 'userSettings'}
		    onChange={handleChange('userSettings')}
		    payload={currentContent}/>
		<ControlPanel 
		    heading="Course Settings"
		    expanded={expanded == 'courseSettings'}
		    onChange={handleChange('courseSettings')}
		    payload={currentContent}/>
		<ControlPanel 
		    heading="Class Sites Settings"
		    expanded={expanded == 'classSitesSettings'}
		    onChange={handleChange('classSitesSettings')}
		    payload={currentContent} />
	
	</div>
      </div>
    );
  }
  return (
    <App
      userLogged={session.userLogged}
      username={session.username}
      payload={render}
    />
  );
}
