import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import OutlinedInput from "@material-ui/core/OutlinedInput"; 
import { fade, makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import FaceIcon from "@material-ui/icons/Face";
import SearchIcon from "@material-ui/icons/Search";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Router from 'next/router'
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withSession } from 'next-session';
import fetch from 'isomorphic-unfetch';

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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  loginButton: {
    marginLeft: theme.spacing(2)
  },
  logoSm: {
    maxWidth: 60,
    maxHeight: 60,
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  logo: {
    maxWidth: 140,
    maxHeight: 45,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  avatar : {
    marginLeft: theme.spacing(2)
  },
  appBar: {
    backgroundColor: "rgba(256,256,256,1)"
  },
  title: {
    flexGrow: 1,
    color: fade(theme.palette.common.black, 0.95),
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    marginTop: theme.spacing(1)
  },
  searchGrid: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0
    }
  },
  search: {
    width: "100%",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: fade(theme.palette.common.black, 0.84)
  },
  inputRoot: {
    width: "100%"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width")
  }
}));

export default function AstralAppBar(props) {
  const [openLoginDialog, setOpenLoginDialog] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [profileMenuItemSelected, setProfileMenuItemSelected] = React.useState("dashboard");
  const classes = useStyles();
  let options = 0;
  let dialogContent = 0;
  if(loginFailed){
	  dialogContent = (<Typography>Login failed, Please try again.</Typography>);
  }else{
	  dialogContent = (<Typography>Use your registered username to login.</Typography>);
  }

  const handleUsernameChange = (e) => {
	  setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
	  setPassword(e.target.value);
  }

  const handleLoginClickOpen = () => {
      setLoginFailed(false); // Reset any errors	  
      setUsername('')
      setPassword('')
      setOpenLoginDialog(true);
  };

  const handleLogin = async () => {
	const data = new URLSearchParams();
        data.append('username', username);
	data.append('password', password);
	const res = await fetch(`/api/authenticate`, {
                    method: 'POST',
		    body: data
	});
	const json = await res.json();
	console.log(json)
	if(json.error){
		console.log(json);
		return;
	}else if(json.login == 'success'){
		window.location.href = '/';
	}else if(json.login == 'failed'){
		setLoginFailed(true);
	}
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };
  const handleProfileMenuClose = () => {
		  setAnchorEl(null);
	  }
	  const handleProfileMenuClick = (event) => {
		  setAnchorEl(event.currentTarget);

	  }
	  const handleDashboard = () => { }

	  const handleLogout = async () => {
		  const res = await fetch(`/api/deauthenticate`,{method: 'get'});
		  const json = await res.json();
		  console.log(json);
		  if(!json.error){
			  window.location.href = '/';
		  }
	  }


  if(props.userLogged){

	  options = (<Box display="flex" alignItems="center" flexDirection="row">
		  <Chip 
                   variant="outlined"
                   icon={<FaceIcon />}
	           className={classes.avatar}
		   label={props.username} />
	   <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleProfileMenuClick}
      >
        <MoreVertIcon />
</IconButton></Box>);
	 }else {
	  options = (
  	   <Button
              color="default"
              variant="outlined"
	      className={classes.loginButton}
              onClick={handleLoginClickOpen}>
              Login
            </Button>
  );
	 }
  return (
    <div>
      <HideOnScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <img src="logo.png" alt="logo" className={classes.logo} />
            <img src="logo_sm.png" alt="logo" className={classes.logoSm} />
            <Grid
              container
              direction="row"
              justify="center"
              className={classes.searchGrid}
            >
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
		<Autocomplete id="mainSearch"
		 freeSolo
		 options={[{title: "Test"}].map(option => option.title)}
                 renderInput={params => (
		<OutlinedInput
		  {...params}	
		  placeholder="Search by Subject Code "
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  InputProps={{ ...params.InputProps, type: 'search' }}
	         />) } />
              </div>
            </Grid>
	    {options}
         </Toolbar>
        </AppBar>
       </HideOnScroll>
    <Dialog open={openLoginDialog} onClose={handleLoginClose} aria-labelledby="form-dialog-title">
	    <DialogTitle id="form-dialog-title">Login</DialogTitle>
	<DialogContent>
	<DialogContentText>
		{dialogContent}
	</DialogContentText>
	<TextField
	    error={loginFailed}
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="username"
	    fullWidth
	    value={username}
            onChange={handleUsernameChange}
           />
	<TextField	  
	    error={loginFailed}
	    margin="dense"
            id="password"
            label="Password"
            type="password"
	    fullWidth
	    value={password}
	    onChange={handlePasswordChange}
	    onKeyPress={(ev) => {
		    if(ev.key == 'Enter'){
			    handleLogin();
			    ev.preventDefault();
		    }
	    }}
        />
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
       <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
          <MenuItem key="dashboard" selected={profileMenuItemSelected == "dashboard"} onClick={handleDashboard}>
	  Dashboard 
	  </MenuItem>
          <MenuItem key="logout" selected={profileMenuItemSelected == "logout"} onClick={handleLogout}>
	  Logout 
	  </MenuItem>
  </Menu>

	 </div>
  );
}
