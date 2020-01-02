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
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Router from "next/router";
import Box from "@material-ui/core/Box";
import SearchBar from './SearchBar.js';

import { withSession } from "next-session";
import fetch from "isomorphic-unfetch";

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
  avatar: {
    marginLeft: theme.spacing(2)
  },
  appBar: {
    backgroundColor: "#212121",
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
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0
    }
  },
  search: {
    width: "100%",
    position: "relative",
    //borderRadius: theme.shape.borderRadius,
    borderRadius: 0,  
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.up("sm")]: {
      width: "60%"
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
  const [openPasswordChangeDialog, setOpenPasswordChangeDialog] = React.useState(false);	
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = React.useState("");     
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [passwordChangeFailed, setPasswordChangeFailed] = React.useState(false);
  const [passwordChangeError, setPasswordChangeError] = React.useState('');
  const [profileMenuItemSelected, setProfileMenuItemSelected] = React.useState(
    "dashboard"
  );
  const classes = useStyles();
  let options = 0;
  let dialogContent = 0;	
  if (loginFailed) {
    dialogContent = <Typography color="error">Login failed, Please try again.</Typography>;
  }else {
    dialogContent = (
      <Typography>Use your registered username to login.</Typography>
    );
  }


  const handleOldPasswordChange = e => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = e => {
    setNewPassword(e.target.value);
  };
  
  const handleNewPasswordConfirmationChange = e => {
    setNewPasswordConfirmation(e.target.value);
  };

  const handleUsernameChange = e => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handlePasswordChangeClick = () => {
    handleProfileMenuClose();	  
    setPasswordChangeFailed(false);
    setOldPassword("");
    setNewPassword("");
    setOpenPasswordChangeDialog(true);
  }
 
  const handleLoginClickOpen = () => {
    setLoginFailed(false); // Reset any errors
    setUsername("");
    setPassword("");
    setOpenLoginDialog(true);
  };

  const changePassword = async () => { 
	  if(newPassword != newPasswordConfirmation){
		  setPasswordChangeError("The new password did not match.");
		  setPasswordChangeFailed(true);
		  return;
	  }
    const data = new URLSearchParams();
    data.append("oldPassword", oldPassword);
    data.append("newPassword", newPassword);
    const res = await fetch(`/api/changePassword`, {
      method: "POST",
      body: data
    });
    const json = await res.json();
    console.log(json);
    if (json.error) {
      console.log(json);
      setOpenPasswordChangeDialog(false);
      return;
    } else if (json.passwordChange == "success") {
      setOpenPasswordChangeDialog(false);
    } else if (json.passwordChange == "failed") {
	  setPasswordChangeError("Could not change password, Possible that you have entered the wrong password.");	     setPasswordChangeFailed(true);
    }
  }

  const handleLogin = async () => {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);
    const res = await fetch(`/api/authenticate`, {
      method: "POST",
      body: data
    });
    const json = await res.json();
    console.log(json);
    if (json.error) {
      console.log(json);
      return;
    } else if (json.login == "success") {
      window.location.href = "/";
    } else if (json.login == "failed") {
      setLoginFailed(true);
    }
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleDashboard = () => {
	  window.location.href = '/';
  };

  const handleLogout = async () => {
    const res = await fetch(`/api/deauthenticate`);
    const json = await res.json();
    console.log(json);
    if (!json.error) {
      window.location.href = "/";
    }
  };

  if (props.userLogged) {
    options = (
	<IconButton
	  color="inherit"
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleProfileMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
    );
  } else {
    options = (
      <Button
        color="inherit"
        variant="outlined"
        className={classes.loginButton}
        onClick={handleLoginClickOpen}
      >
        Login
      </Button>
    );
  }
  return (
    <div>
      <HideOnScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <img src="logo_white.png" alt="logo" className={classes.logo} />
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
	  	  <SearchBar />
	
  </div>
            </Grid>
            {options}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Dialog
        open={openLoginDialog}
        onClose={handleLoginClose}
        aria-labelledby="login-dialog"
      >
        <DialogTitle id="login-dialog">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
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
            onKeyPress={ev => {
              if (ev.key == "Enter") {
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
      <Dialog
        open={openPasswordChangeDialog}
	onClose={() => {setOpenPasswordChangeDialog(false)} }
        aria-labelledby="password-change-dialog"
      >
        <DialogTitle id="password-change-dialog">Change Password</DialogTitle>
        <DialogContent>
		<DialogContentText>{passwordChangeFailed && 
			                (<Typography color="error">{passwordChangeError}</Typography>)}</DialogContentText>
          <TextField
            error={passwordChangeFailed}
            autoFocus
            margin="dense"
            id="oldpassword"
            label="Old Password"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={handleOldPasswordChange}
          />
          <TextField
            error={passwordChangeFailed}
            margin="dense"
            id="newpassword"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={handleNewPasswordChange}
        />
	<TextField
            error={passwordChangeFailed}
            margin="dense"
            id="newpasswordconfirmation"
            label="New Password Confirmation"
            type="password"
            fullWidth
            value={newPasswordConfirmation}
            onChange={handleNewPasswordConfirmationChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                changePassword();
                ev.preventDefault();
              }
            }}
          />
        
        </DialogContent>
        <DialogActions>
	<Button onClick={()=> { setOpenPasswordChangeDialog(false); }} color="primary">
            Cancel
          </Button>
          <Button onClick={changePassword} color="primary">
            Proceed
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
      <MenuItem disabled={true}>
	      <Chip
	  color="default"
          variant="outlined"
          icon={<FaceIcon />}
          className={classes.avatar}
          label={props.username}
  />
      </MenuItem>
      <MenuItem
          key="dashboard"
          selected={profileMenuItemSelected == "dashboard"}
          onClick={handleDashboard}
        >
          Dashboard
       </MenuItem>
       <MenuItem
	  key="changepassword"
	  selected={profileMenuItemSelected == "changepassword"}
	  onClick={handlePasswordChangeClick}
        > 
		Change Password
	</MenuItem>
        <MenuItem
          key="logout"
          selected={profileMenuItemSelected == "logout"}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
