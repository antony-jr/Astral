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
	const [error, setError] = React.useState(false);
	const [errMsg, setErrMsg] = React.useState('');
	const [data, setData] = React.useState([]);
	const { enqueueSnackbar } = useSnackbar();

	const [course, setCourse] = React.useState('');
	const [regulation, setRegulation] = React.useState(0);
	const [subjectCode, setSubjectCode] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [description, setDescription] = React.useState('');

	// variant could be success, error, warning, info, or default
        // enqueueSnackbar('This is a success message!', { variant });

	React.useEffect(() => {
		refresh();
	}, []);

	const handleCourseChange = e => {
		setCourse(e.target.value);
	};

	const handleRegulationChange = e => {
		if(!isNaN(e.target.value)){
			setRegulation(e.target.value);
		}
	}

	const handleSubjectCodeChange = e => {
		setSubjectCode(e.target.value);
	}

	const handleTitleChange = e => {
		setTitle(e.target.value);
	}

	const handleDescriptionChange = e => {
		setDescription(e.target.value);
	}

	const handleAddCourse = () => {
		setCourse('');
		setRegulation(0);
		setSubjectCode('');
		setTitle('');
		setDescription('');
		setOpenDialog(true);
	}

	const removeCourses = (data) => {
		if(data.length == 0){
			return;
		}

		for(var iter = 0; iter < data.length; ++iter){
			const _course = data[iter].Course;
			const _reg = data[iter].Regulation;
			const _code = data[iter].SubjectCode;

			const sendData = new URLSearchParams();
			sendData.append("course", _course);
			sendData.append("regulation", _reg);
			sendData.append("subjectcode", _code);

			axios
			.post('/api/removeCourse', sendData)
			.then(({data}) => {
				if(data.error){
					enqueueSnackbar("Cannot remove " + _code, {variant: "error"});
				}else{
					refresh();
				}
			});
		
		}
		enqueueSnackbar("Selected courses removed", {variant: "success"});

	}

	const submitAddCourse = () => {
		if(course.length == 0 ||
	           regulation.length == 0 ||
		   subjectCode.length == 0 ||
		   title.length == 0
		   ){
			setError(true);
			setErrMsg("All fields are required!");
			return;
		}else{
			setError(false);
		}

		setOpenDialog(false);
		const sendData = new URLSearchParams();
		sendData.append("course", course);
		sendData.append("regulation" , regulation );
		sendData.append("subjectcode" , subjectCode);
		sendData.append("title", title);
		sendData.append("description", description);
		axios
		.post('/api/addCourse', sendData)
		.then(({data}) => {
			if(data.error){
				enqueueSnackbar("Cannot add course", {variant: "error"});
			}else{
				if(data.creation == "success"){
					enqueueSnackbar("Course added", {variant: "success"});
					refresh();
				}
			}
		});
	}

	const refresh = () => {
		// Refresh all rows in the table.
		axios
		.get('/api/getCourses')
		.then(({data}) => {
			if(data.error){
				enqueueSnackbar("Could not retrive course information",  {variant: "error"});
			}else{
				setData(data.courses);
			}
		});
	}

	const handleClose = () => {
		setOpenDialog(false);
	}

	const columns = [
        { title: 'Course', field: 'Course' },
        { title: 'Regulation', field: 'Regulation'},
	{ title: 'Title', field: 'Title' },
	{ title: 'Subject Code', field: 'SubjectCode'},
       ]

	return (
		<React.Fragment>
	<MaterialTable
		title="Manage Courses"
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
            tooltip: 'Remove All Selected Courses',
            icon: TableIcons.Delete,
            onClick: (evt, data) => { removeCourses(data) } 
	  },
	  {
            icon: TableIcons.Export,
            tooltip: 'Create Class',
            onClick: (event, rowData) =>{alert("You saved " + rowData.name)}
          },
	  {
	    icon: TableIcons.Add,
	    tooltip: 'Add Course',
	    isFreeAction: true,
	    onClick: (event) => {setOpenDialog(true)},
	  },
	  ]}
			icons={TableIcons}/>
	<Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>
          Add Course
        </DialogTitle>
	<DialogContent dividers>
	{error && <Typography color="error">{errMsg}</Typography>}
	<TextField
            error={error}
            margin="dense"
            id="course"
            label="Course"
            type="text"
            fullWidth
            value={course}
            onChange={handleCourseChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddCourse();
                ev.preventDefault();
              }
            }}
          />
 	<TextField
            error={error}
            margin="dense"
            id="subjectCode"
            label="Subject Code"
            type="text"
            fullWidth
            value={subjectCode}
            onChange={handleSubjectCodeChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddCourse();
                ev.preventDefault();
              }
            }}
          />
 
	<TextField
            error={error}
            margin="dense"
            id="regulation"
            label="Regulation"
            type="text"
            fullWidth
            value={regulation}
            onChange={handleRegulationChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddCourse();
                ev.preventDefault();
              }
            }}
          />
 	<TextField
            error={error}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddCourse();
                ev.preventDefault();
              }
            }}
          />
 

	<TextField
            error={error}
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddCourse();
                ev.preventDefault();
              }
            }}
          />


        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={submitAddCourse} color="primary">
            ADD 
          </Button>
        </DialogActions>
      	</Dialog>
	</React.Fragment>);
}

