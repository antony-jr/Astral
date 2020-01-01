import React from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

import { withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import {
	Dialog,
	IconButton,
	ExpansionPanelDetails,
	ExpansionPanelActions,
	Button,
	Typography,
	Box,
	Container,
	Paper,
	TextField
} from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import TableIcons from './TableIcons.js'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});


const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


export default function UserSettings(props){
	const [openDialog, setOpenDialog] = React.useState(false);
	const [usernameError, setUsernameError] = React.useState(false);
	const [genError, setGenError] = React.useState(false);
	const [errMsg, setErrMsg] = React.useState(null);
	const [username, setUsername] = React.useState('');
	const [legalName, setLegalName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [data, setData] = React.useState([]);
	const { enqueueSnackbar } = useSnackbar();
	// variant could be success, error, warning, info, or default
        // enqueueSnackbar('This is a success message!', { variant });

	React.useEffect(() => {
		refresh();
	}, []);


	const handleUsernameChange = e => {
		setUsername(e.target.value);
		if(e.target.value.toLowerCase() == 'administrator'){
			setErrMsg("You cannot use a reserved username!");
			setUsernameError(true);
			return;
		}else{
			setUsernameError(false);
		}
		var didError = false;
		for(var iter = 0; iter < data.length; ++iter){
			if(data[iter].UserID == e.target.value){
				setErrMsg("Username already exists!");
				setUsernameError(true);
				didError = true;
				break;
			}
		}
		if(!didError){
			setUsernameError(false);
		}
	}

	const handleLegalNameChange = e => {
		setLegalName(e.target.value);
	}

	const handleEmailChange = e => {
		setEmail(e.target.value);
	}

	const handleAddUser = () => {
		setUsernameError(false);
		setGenError(false);
		setUsername('');
		setLegalName('');
		setEmail('');
		setOpenDialog(true);
	}

	const removeUsers = (data) => {
		if(data.length == 0){
			return;
		}

		enqueueSnackbar("Deleting selected users" , {variant: "info"});
		for(var iter = 0; iter < data.length; ++iter){
			const UN = data[iter].UserID;
			const sendData = new URLSearchParams();
			sendData.append("username", UN);
			axios
			.post('/api/removeUser', sendData)
			.then(({data}) => {
				if(data.error){
					enqueueSnackbar("Cannot remove " + UN, {variant: "error"});
				}else{
					refresh();
				}
			});
		
		}
		enqueueSnackbar("Selected users removed", {variant: "success"});

	}

	const submitAddUser = () => {
		if(username.length == 0 ||
		   email.length == 0 ||
	           legalName.length == 0){
			setGenError(true);
			setErrMsg("All fields are required!");
			return;
		}else{
			setGenError(false);
		}

		setOpenDialog(false);
		enqueueSnackbar("User registration in progress", {variant: "info"});
		const sendData = new URLSearchParams();
		sendData.append("username", username);
		sendData.append("legalName" , legalName);
		sendData.append("email" , email);
		axios
		.post('/api/addUser', sendData)
		.then(({data}) => {
			if(data.error){
				enqueueSnackbar("User registration failed", {variant: "error"});
			}else{
				if(data.creation == "success"){
					enqueueSnackbar("User registered", {variant: "success"});
					refresh();
				}
			}
		});
	}

	const refresh = () => {
		// Refresh all rows in the table.
		axios
		.get('/api/getUsers')
		.then(({data}) => {
			if(data.error){
				enqueueSnackbar("Could not retrive user information",  {variant: "error"});
			}else{
				setData(data.users);
			}
		});
	}

	const handleClose = () => {
		setOpenDialog(false);
	}

	const columns = [
        { title: 'Legal Name', field: 'LegalName' },
        { title: 'Username', field: 'UserID'},
        { title: 'Email', field: 'EmailID' },
       ]

	return (
		<React.Fragment>
	<MaterialTable
		title="Manage Users"
		components={{
			Container: props => <Paper {...props} elevation={0}/>
		}}
		columns={columns}
		data={data}
		options={{
			selection: true,
			showTitle: true,
		}}
		actions={[
          {
            tooltip: 'Remove All Selected Users',
            icon: TableIcons.Delete,
            onClick: (evt, data) => { removeUsers(data) } 
	  },
	  {
	    icon: TableIcons.Add,
	    tooltip: 'Add User',
	    isFreeAction: true,
	    onClick: (event) => {setOpenDialog(true)},
	  },
	  ]}
			icons={TableIcons}/>
	<Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>
          Add User
        </DialogTitle>
	<DialogContent dividers>
	{(usernameError || genError) && <Typography color="error">{errMsg}</Typography>}
	<TextField
            error={usernameError || genError}
            margin="dense"
            id="username"
            label="Username"
            type="username"
            fullWidth
            value={username}
            onChange={handleUsernameChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddUser();
                ev.preventDefault();
              }
            }}
          />
 	<TextField
            error={genError}
            margin="dense"
            id="legalName"
            label="Legal Name"
            type="text"
            fullWidth
            value={legalName}
            onChange={handleLegalNameChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddUser();
                ev.preventDefault();
              }
            }}
          />
 
	<TextField
            error={genError}
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddUser();
                ev.preventDefault();
              }
            }}
          />
 

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={submitAddUser} color="primary">
            ADD 
          </Button>
        </DialogActions>
      	</Dialog>
	</React.Fragment>);
}

