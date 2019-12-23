import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";

export default function PageLoader() {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minWidth: "90vw", minHeight: "90vh" }}
    >
      <CircularProgress style={{ color: "black" }} />
    </Grid>
  );
}
