import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import App from '../../components/App.js';

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

function ClassSite() {
	const router = useRouter();
	const classes = useStyles();
  	const bull = <span className={classes.bullet}>•</span>;
	const [tabValue, setTabValue] = React.useState(0);
	const [session, setSession] = React.useState({
					userLogged: false,
		username: ''});
	const size = useWindowSize();
	
	React.useEffect(() => {
		axios.get("/api/getSession").then(({ data }) => {
			setSession(data);
		});
	}, []);

	const handleTabClick = (event, value) => {
		setTabValue(value);
	}

	let render = (
		<Paper elevation={5} square className={classes.headPaper}>
			<Container width="lg">
			<br />
			<Typography className={classes.headText} variant={size.width <= 400 ? "h5" : "h4"}>
				<b>CS8391</b> {bull} Data Structures {bull} <b>R17</b>
			</Typography> 
			<Typography className={classes.headText} variant={size.width <= 400 ? "h6" : "h5"}>
				<b>Fall / 2020</b>
			</Typography>
			<Typography className={classes.headText} variant="body2" >
				This course explores various fundamental data structures presend in computer
				science such as Graphs,Trees,Arrays,Disjoint sets and much more.
			</Typography>
			<br />
			<Tabs  
			indicatorColor="secondary" 
			value={tabValue} 
			onChange={handleTabClick}
			variant="scrollable"
          		scrollButtons="auto"
			textColor="" 
			style={{color: 'white'}}>
			<Tab label="Course Home"/>
			<Tab label="Homework"/>
			<Tab label="Materials"/>
			<Tab label="Information"/>
		        </Tabs>
			</Container>
		</Paper>
	);
	
	return <App userLogged={session.userLogged} username={session.username} payload={render} />
}

export default function Page(){
	return <ClassSite />;
}
