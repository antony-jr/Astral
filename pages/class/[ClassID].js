import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import App from '../../components/App.js';

// Content for tabs
import ClassHome from '../../components/ClassHome.js';
import Materials from '../../components/Materials.js';

import {
	Typography,
	Divider,
	Chip,
	Paper,
	Container,
	Tabs,
	Tab
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  headPaper: {
    backgroundColor: '#212121',
  },
  headText: {
	  color: 'white',
  }
});

function useWindowSize() {
  const isClient = typeof window === 'object';
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }
  const [windowSize, setWindowSize] = React.useState(getSize);
  React.useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function ClassSite(props) {
	const router = useRouter();
	const classes = useStyles();
  	const bull = <span className={classes.bullet}>•</span>;
	const [tabValue, setTabValue] = React.useState(0);
	const [session, setSession] = React.useState({
					userLogged: false,
		username: ''});
	const size = useWindowSize();
	const [tabContent, setTabContent] = React.useState(null);
	const [classInfo, setClassInfo] = React.useState({});

	React.useEffect(() => {
		axios.get("/api/getSession").then(({ data }) => {
			setSession(data);
			axios.get("/api/getClassSiteInfo?" + router.query.ClassID).then(({ data }) => {
			setClassInfo(data);
			setTabContent(
				<ClassHome 
					ClassID={router.query.ClassID}/>
			);
			});

		});
	}, [router]);
	const handleTabClick = (event, value) => {
		setTabValue(value);
		console.log(value);
		switch(value){
			case 0:
				setTabContent(<ClassHome ClassID={router.query.ClassID}/>);
				break;
		        case 1:
		      		setTabContent(<Materials ClassID={router.query.ClassID}/>);
		      		break;
		   	default:
				setTabContent(null);
				break;
		}
	
	}

	let render = (
		<React.Fragment>
			<Container width="lg">
			<br />
			<Typography variant={size.width <= 400 ? "h5" : "h4"}>
				<b>{classInfo.subject_code}</b> {bull} {classInfo.title} {bull} <b>R{classInfo.regulation}</b>
			</Typography> 
			<Typography variant={size.width <= 400 ? "h6" : "h5"}>
				<b>{classInfo.season} / {classInfo.year}</b>
			</Typography>
			<br />
			<Typography variant="body2" >
				{classInfo.description}
			</Typography>
			<br /> 
			<Tabs  
			indicatorColor="secondary" 
			value={tabValue} 
			onChange={handleTabClick}
			variant="scrollable"
          		scrollButtons="auto">
			<Tab label="Class Home"/>
			<Tab label="Materials"/>
			</Tabs>
		</Container>
		{tabContent}
	</React.Fragment>	
	);
	
	return <App userLogged={session.userLogged} username={session.username} payload={render} />
}

export default ClassSite;
