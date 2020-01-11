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

import AnnouncementEntry from "./AnnouncementEntry.js";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function ClassHome(props) {
  const classes = useStyles();
  const [information, setInformation] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [message, setMessage] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    axios.get("/api/getClassHome?" + props.ClassID).then(({ data }) => {
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

  const handleMessageChange = e => {
    setMessage(e.target.value);
  };

  const handleAddBtn = () => {
    setMessage("");
    setError(false);
    setOpen(true);
  };

  const handleDelete = id => {
    const sendData = new URLSearchParams();
    sendData.append("MsgID", id);
    sendData.append("ClassID", props.ClassID);
    axios.post("/api/removeAnnouncement", sendData).then(({ data }) => {
      if (data.error) {
        enqueueSnackbar("Failed to remove message", { variant: "error" });
      } else {
        enqueueSnackbar("Announcement removed", { variant: "success" });
        setLoading(true);
        axios.get("/api/getClassHome?" + props.ClassID).then(({ data }) => {
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

  const handleNewAnnouncement = () => {
    if (message.length == 0) {
      setError(true);
      setReason("Empty Announcements are not allowed");
      return;
    }

    const sendData = new URLSearchParams();
    sendData.append("Message", message);
    sendData.append("ClassID", props.ClassID);
    axios.post("/api/addAnnouncement", sendData).then(({ data }) => {
      if (data.error) {
        setError(true);
        setReason(data.reason);
        return;
      } else {
        setOpen(false);
        enqueueSnackbar("Announcement added", { variant: "success" });
        setLoading(true);
        axios.get("/api/getClassHome?" + props.ClassID).then(({ data }) => {
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
        <Grid item></Grid>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Container style={{ marginTop: "40px" }} width="lg">
        <Typography variant="body1">
          Instructor(s): <b>{information && information.instructor}</b>
        </Typography>
        <Typography variant="body1">
          Lecture: <b>{information && information.lecture}</b>
        </Typography>
        <Typography variant="body1">
          Timings: <b>{information && information.timings}</b>
        </Typography>
        <br />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Typography variant="h4">Announcements</Typography>
          {information && information.show_control && (
            <Fab
              className={classes.margin}
              size="small"
              onClick={handleAddBtn}
              color="secondary"
            >
              <AddIcon />
            </Fab>
          )}
        </Grid>
        <Divider />
        <Grid
          container
          style={{ marginTop: "20px" }}
          spacing={1}
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          {information &&
            information.announcements.map((entry, iteration) => (
              <Grid item style={{ width: "100%" }}>
                <AnnouncementEntry
                  datetime={entry.MsgTimestamp}
                  author={entry.Author}
                  body={entry.Msg}
                  id={entry.MsgID}
                  showControl={information.show_control}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>New Announcement</DialogTitle>
        <DialogContent>
          <TextField
            error={error}
            multiline
            helperText={reason}
            autoFocus
            margin="dense"
            id="message"
            label="Announcement"
            type="text"
            fullWidth
            value={message}
            onChange={handleMessageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewAnnouncement} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
