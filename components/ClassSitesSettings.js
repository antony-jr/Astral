import React from "react";
import axios from "axios";
import MaterialTable from "material-table";

import { withStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

import {
  Dialog,
  IconButton,
  AccordionDetails,
  AccordionActions,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  TextField
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import TableIcons from "./TableIcons.js";

import CourseAutocomplete from "./CourseAutocomplete.js";
import UserAutocomplete from "./UserAutocomplete.js";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function UserSettings(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [data, setData] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [courseID, setCourseID] = React.useState("");
  const [year, setYear] = React.useState(0);
  const [season, setSeason] = React.useState("");
  const [userIncharge, setUserIncharge] = React.useState("");
  const [lecture, setLecture] = React.useState("");
  const [timings, setTimings] = React.useState("");

  // variant could be success, error, warning, info, or default
  // enqueueSnackbar('This is a success message!', { variant });

  React.useEffect(() => {
    refresh();
  }, []);

  const handleCourseIDChange = (e, value) => {
    if(value){  
	    setCourseID(value.CourseID);
    }
  };

  const handleYearChange = e => {
    if (!isNaN(e.target.value)) {
      setYear(e.target.value);
    }
  };

  const handleSeasonChange = e => {
    setSeason(e.target.value);
  };

  const handleUserInchargeChange = (e, value) => {
     if(value){
	     setUserIncharge(value.UserID);
     }
  };

  const handleLectureChange = e => {
    setLecture(e.target.value);
  };

  const handleTimingsChange = e => {
    setTimings(e.target.value);
  };

  const handleAddClassSite = () => {
    setCourseID("");
    setYear("");
    setSeason("");
    setUserIncharge("");
    setLecture("");
    setTimings("");
    setOpenDialog(true);
  };

  const removeClassSites = data => {
    if (data.length == 0) {
      return;
    }

    for (var iter = 0; iter < data.length; ++iter) {
      const _ClassID = data[iter].ClassID;

      const sendData = new URLSearchParams();
      sendData.append("ClassID", _ClassID);

      axios.post("/api/removeClassSite", sendData).then(({ data }) => {
        if (data.error) {
          enqueueSnackbar("Cannot remove " + _code, { variant: "error" });
        } else {
          refresh();
        }
      });
    }
    enqueueSnackbar("Selected class sites are removed", { variant: "success" });
  };

  const submitAddClassSite = () => {
    if (
      courseID.length == 0 ||
      year.length == 0 ||
      season.length == 0 ||
      userIncharge.length == 0
    ) {
      setError(true);
      setErrMsg("All fields are required!");
      return;
    } else {
      setError(false);
    }

    setOpenDialog(false);
    enqueueSnackbar("Class addition in progress", { variant: "info" });
    const sendData = new URLSearchParams();
    sendData.append("CourseID", courseID);
    sendData.append("Year", year);
    sendData.append("Season", season);
    sendData.append("UserIncharge", userIncharge);
    sendData.append("Lecture", lecture);
    sendData.append("Timings", timings);

    axios.post("/api/addClassSite", sendData).then(({ data }) => {
      if (data.error) {
        console.log(data.reason);
        enqueueSnackbar("Cannot add class site", { variant: "error" });
      } else {
        if (data.creation == "success") {
          enqueueSnackbar("Class site added", { variant: "success" });
          refresh();
        } else {
          enqueueSnackbar(data.reason, { variant: "error" });
        }
      }
    });
  };

  const refresh = () => {
    // Refresh all rows in the table.
    axios.get("/api/getClassSites").then(({ data }) => {
      if (data.error) {
        enqueueSnackbar("Could not retrive course information", {
          variant: "error"
        });
      } else {
        setData(data.classes);
      }
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const columns = [
    { title: "Subject Code", field: "SubjectCode" },
    { title: "Regulation", field: "Regulation" },
    { title: "Title", field: "Title" },
    { title: "Year", field: "Year" },
    { title: "Season", field: "Season" },
    { title: "Incharge", field: "UserIncharge" }
  ];

  return (
    <React.Fragment>
      <MaterialTable
        title="Class Sites"
        components={{
          Container: props => <Paper {...props} elevation={0} />
        }}
        columns={columns}
        data={data}
        options={{
          selection: true,
          showTitle: true
        }}
        actions={[
          {
            tooltip: "Remove All Selected Class Sites",
            icon: TableIcons.Delete,
            onClick: (evt, data) => {
              removeClassSites(data);
            }
          },
          {
            icon: TableIcons.Add,
            tooltip: "Add Class Site",
            isFreeAction: true,
            onClick: handleAddClassSite
          }
        ]}
        icons={TableIcons}
      />
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Add Class Site</DialogTitle>
        <DialogContent dividers>
          {error && <Typography color="error">{errMsg}</Typography>}
          <div style={{ marginTop: "10px" }}>
            <CourseAutocomplete error={error} onChange={handleCourseIDChange} />
          </div>
          <div style={{ marginTop: "10px" }}>
            <UserAutocomplete
              error={error}
              onChange={handleUserInchargeChange}
            />
          </div>
          <TextField
            error={error}
            margin="dense"
            id="year"
            label="Year"
            type="text"
            fullWidth
            value={year}
            onChange={handleYearChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddClassSite();
                ev.preventDefault();
              }
            }}
          />

          <TextField
            error={error}
            margin="dense"
            id="season"
            label="Season"
            type="text"
            fullWidth
            value={season}
            onChange={handleSeasonChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddClassSite();
                ev.preventDefault();
              }
            }}
          />
          <TextField
            error={error}
            margin="dense"
            id="lecture"
            label="Lecture"
            type="text"
            fullWidth
            value={lecture}
            onChange={handleLectureChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddClassSite();
                ev.preventDefault();
              }
            }}
          />
          <TextField
            error={error}
            margin="dense"
            id="timings"
            label="Timings"
            type="text"
            fullWidth
            value={timings}
            onChange={handleTimingsChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                submitAddClassSite();
                ev.preventDefault();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={submitAddClassSite} color="primary">
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
