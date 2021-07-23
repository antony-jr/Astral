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
import MaterialEntry from "./MaterialEntry.js"

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function Materials(props) {
  const classes = useStyles();
  const [information, setInformation] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState(false);
  const [errorDesc, setErrorDesc] = React.useState(false);
  const [reasonTitle, setReasonTitle] = React.useState("");
  const [reasonDesc, setReasonDesc] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [session, setSession] = React.useState({
    userLogged: false,
    username: ""
  });
 
  React.useEffect(() => {
    axios.get("/api/getMaterials?" + props.ClassID).then(({ data }) => {
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

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleAddBtn = () => {
    resetErrors();
    setTitle('');
    setDescription('');
    setOpen(true);
  };

  const handleDelete = id => {
    const sendData = new URLSearchParams();
    sendData.append("ClassID", props.ClassID);
    sendData.append("MaterialID", id);
    axios.post("/api/removeMaterial", sendData).then(({data}) => {
	    if(data.error){
	 enqueueSnackbar("Cannot remove material", {variant: "error"});
		    return;
	    }else{
   	    enqueueSnackbar("Material removed", { variant: "success" });
        setLoading(true);
	        axios.get("/api/getMaterials?" + props.ClassID).then(({ data }) => {
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
  }

  const handleNewMaterial = () => {
    resetErrors();
    if(title.length == 0){
	    setErrorTitle(true)
	    setReasonTitle("Title is required");
	    return;
    }else if(description.length == 0){
	    setErrorDesc(true)
	    setReasonDesc("Description is required");
    }
    const sendData = new URLSearchParams();
    sendData.append("ClassID", props.ClassID);
    sendData.append("Title", title);
    sendData.append("Description", description);
    axios.post("/api/addMaterial", sendData).then(({ data }) => {
	    if(data.error){
		    setOpen(false);
		    console.log(data);
		    enqueueSnackbar("Cannot add Material", { variant: "error" });
	    }else{
		    setOpen(false);
        	    enqueueSnackbar("Material added", { variant: "success" });
        	    setLoading(true);
	        axios.get("/api/getMaterials?" + props.ClassID).then(({ data }) => {
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
			Add Material</Button>
	      }
	 <div>
	<div>
	<br/>
	{information && information.materials.map((entry, iter) =>
	<MaterialEntry
	    showControl={information.show_control}
	    id={entry.MaterialID}
	    onDelete={handleDelete}
	    description={entry.MaterialDescription}
	    heading={entry.MaterialTitle}
	 />)
	}
        </div>
      </div>
       
      </Container>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>New Material</DialogTitle>
        <DialogContent>
          <TextField
            error={errorTitle}
            helperText={reasonTitle}
            autoFocus
            margin="dense"
            id="materialtitle"
            label="Material Title"
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
            id="materialdesc"
            label="Material Description"
            type="text"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}/>
        
	</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewMaterial} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
