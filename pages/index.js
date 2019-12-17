import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Head from 'next/head';
import Router from 'next/router';

import PageLoader from '../components/PageLoader.js'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
	  backgroundColor: 'rgba(34,34,34,0.95)',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'center',
  },
  menuBtn: {
	  justifyContent: "center",
  },
  progress: {
	  color: 'rgb(34,34,34)',
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Home(props) {
	return (<Typography>Hello World!</Typography>);
}

function Main(props) {
  const classes = useStyles();	
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
	
  const handleListItemClick = (event, index) => {	  
    setSelectedIndex(index);
    setOpen(false);
  };

  function openDrawer(){
	  setOpen(true);
  }

  function handleClose(){
	  setOpen(false);
  }
 
  function showContent(){
	  const index = Number(selectedIndex);
	  let r = null;
	  switch(index){
		  default:
			  r = (<Home/>);
			  break;
	  }
	  return r;
  }

  const doOpen = Boolean(open);

  return (
	  <div>
	  <Grid container direction="column" justify="flex-start" className={classes.root}>
	     <HideOnScroll {...props}> 
		     <AppBar position="fixed" className={classes.appBar}>
			     <Toolbar>
				     <Grid container direction="row" justify="center" alignItems="center" >
					    <IconButton 
						     color="inherit"
						     aria-label="menu"
						     onClick={openDrawer}
					             >
						     <MenuIcon />
					     </IconButton>
				     </Grid>
			     </Toolbar>
		     </AppBar>
	     </HideOnScroll>
	  <Toolbar />
	  <Box>
		  {showContent()}
	  </Box>
  </Grid>
  <Drawer anchor="top" open={doOpen} onClose={handleClose}>
	     <div className={classes.root}>
		     <div className={classes.drawerHeader}>
			     <IconButton onClick={handleClose}>
				     <ExpandLessIcon />
			     </IconButton>
		     </div>
		     <Divider /> 
		     <List component="nav" aria-label="main mailbox folders">
			     <ListItem
				     button
				     selected={selectedIndex === 0}
				     onClick={event => handleListItemClick(event, 0)}
			     >
				     <ListItemText primary="Home" />
		             </ListItem>
			     <ListItem
				     button
				     selected={selectedIndex === 1}
				     onClick={event => handleListItemClick(event, 1)}
			     >
				     <ListItemText primary="Projects" />
		             </ListItem>


			     <Divider />
			     <List component="nav" aria-label="secondary mailbox folder">
				     <ListItem
					     button
					     selected={selectedIndex === 2}
					     onClick={event => handleListItemClick(event, 2)}
				     >
					     <ListItemText primary="About" />
				     </ListItem>
				     <ListItem
					     button
					     selected={selectedIndex === 3}
					     onClick={event => handleListItemClick(event, 3)}
				     >
					     <ListItemText primary="Contact" />
				     </ListItem>
			     </List>
		     </List>
	      </div>
      </Drawer>
      </div>
  );
}

class App extends React.Component {
   constructor(props){
	   super(props);
	   this.state = {isLoading: true};

   }
   componentDidMount(){
	   setTimeout(() => {
		   this.setState({ isLoading : false });
	   }, 3000);

   }
   render(){
        if(this.state.isLoading){
		return (
			<div>
				<Head>
					<title>Astral | Course Mangement System</title>
				</Head>
				<PageLoader />
			</div>
		);
	}
	return (
		<div>
			<Head>
				<title>Astral | Course Mangement System</title>
				<link
			         href="https://fonts.googleapis.com/css?family=Indie+Flower|Liu+Jian+Mao+Cao&display=swap"
				 rel="stylesheet" /> 
			        <link
				 href="https://fonts.googleapis.com/css?family=Nixie+One&display=swap" rel="stylesheet" />  
			 </Head>
			<Main />
		</div>
	);
   }
}


export default App;

