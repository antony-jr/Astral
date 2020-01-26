import React from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

import {
  Container,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CircularProgress from "@material-ui/core/CircularProgress";
import HomeworkEntry from "./HomeworkEntry.js"

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function Homework(props) {
  const classes = useStyles();
  const [information, setInformation] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState(false);
  const [errorDesc, setErrorDesc] = React.useState(false);
  const [errorDate, setErrorDate] = React.useState(false);
  const [reasonTitle, setReasonTitle] = React.useState("");
  const [reasonDesc, setReasonDesc] = React.useState("");
  const [reasonDate, setReasonDate] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [session, setSession] = React.useState({
    userLogged: false,
    username: ""
  });
 
  React.useEffect(() => {
    axios.get("/api/getHomework?" + props.ClassID).then(({ data }) => {
      if (data.error) {
        return;
      }
      setInformation(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleDateChange = e => {
    console.log(e.target.value);	  
    setDate(e.target.value);
  };


  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleAddBtn = () => {
    resetErrors();
    setTitle('');
    setDescription('');
    setDate('');
    setReasonDate('Deadline');
    setOpen(true);
  };

  const handleDelete = id => {
    const sendData = new URLSearchParams();
    sendData.append("ClassID", props.ClassID);
    sendData.append("HomeworkID", id);
    axios.post("/api/removeHomework", sendData).then(({data}) => {
	    if(data.error){
	 enqueueSnackbar("Cannot remove homework", {variant: "error"});
		    return;
	    }else{
   	    enqueueSnackbar("Homework removed", { variant: "success" });
        setLoading(true);
	        axios.get("/api/getHomework?" + props.ClassID).then(({ data }) => {
      if (data.error) {
        return;
      }
      setInformation(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
 

	    }
    });
  };

  const resetErrors = () => {
    setErrorTitle(false);
    setErrorDesc(false);
    setErrorDate(false);
  }

  const handleNewHomework = () => {
    resetErrors();
    if(title.length == 0){
	    setErrorTitle(true)
	    setReasonTitle("Title is required");
	    return;
    }else if(description.length == 0){
	    setErrorDesc(true)
	    setReasonDesc("Description is required");
    }else if(date.length == 0){
	    setErrorDate(true);
	    setReasonDate("Invalid Date");
	    console.log(date);
    }
    const sendData = new URLSearchParams();
    sendData.append("ClassID", props.ClassID);
    sendData.append("Title", title);
    sendData.append("Description", description);
    sendData.append("Deadline", date);
    axios.post("/api/addHomework", sendData).then(({ data }) => {
	    if(data.error){
		    setOpen(false);
		    console.log(data);
		    enqueueSnackbar("Cannot add Homework", { variant: "error" });
	    }else{
		    setOpen(false);
        	    enqueueSnackbar("Homework added", { variant: "success" });
        	    setLoading(true);
	        axios.get("/api/getHomework?" + props.ClassID).then(({ data }) => {
      if (data.error) {
        return;
      }
      setInformation(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
 
	    }
    });    
  };

  if (loading) {
    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        direction="column"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress style={{ color: "black" }} />
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Container style={{ marginTop: "40px" }} width="lg">
	      {information && information.show_control &&
		      <Button 
	      		onClick={handleAddBtn}
		      	style={{width: '100%'}}
		      	variant="outlined"
			color="secondary">
			Add Homework</Button>
	      }
	 <div>
	<div>
	<br/>
	{information && information.homeworks.map((entry, iter) =>
	<HomeworkEntry
	    showControl={information.show_control}
	    id={entry.HomeworkID}
	    onDelete={handleDelete}
	    deadline={entry.Deadline}
	    heading={entry.HomeworkTitle}
	    author={entry.Author}
	 />)
	}
        </div>
      </div>
       
      </Container>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>New Homework</DialogTitle>
        <DialogContent>
          <TextField
            error={errorTitle}
            helperText={reasonTitle}
            autoFocus
            margin="dense"
            id="homeworktitle"
            label="Homework Title"
            type="text"
            fullWidth
            value={title}
            onChange={handleTitleChange}
    />
              <TextField
            error={errorDesc}
	    helperText={reasonDesc}
	    multiline
            margin="dense"
            id="homeworkdesc"
            label="Homework Description"
            type="text"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}/>
           <TextField
            error={errorDate}
	    helperText={reasonDate}
            margin="dense"
	    id="homeworkdeadline"
            type="date"
	    fullWidth
            value={date}
            onChange={handleDateChange}
          /> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewHomework} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
