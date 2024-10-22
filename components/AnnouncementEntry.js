import React from "react";
import {
  Paper,
  Container,
  Typography,
  Divider,
  IconButton,
  Grid
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";

export default function(props) {
  const handleBtn = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
    return;
  };

  const humanDate = (new Date(props.datetime)).toDateString();
  const humanTime = (new Date(props.datetime)).toTimeString();

  return (
    <Paper square elevation={5} style={{ width: "100%" }}>
      <Container width="lg">
        <br />
        <Typography variant="body2">
          <b>{humanDate + " " + humanTime}</b> by <b>{props.author}</b>
          {props.showControl && (
            <IconButton size="sm" onClick={handleBtn} color="secondary">
              <DeleteIcon />
            </IconButton>
          )}
        </Typography>
        <Divider />
        <br />
        <Typography variant="body1">{props.body}</Typography>
        <br />
      </Container>
    </Paper>
  );
}
