import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  card: {
    minWidth: 100,
    maxWidth: 300
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function CourseCard(props) {
  const classes = useStyles();
  const handleClick = () => {
    if (typeof props.location == "undefined" || props.location == null) {
      return;
    }
    window.location.href = props.location;
  };

  const trimSize = 180;
  var text = props.desc;
  if (typeof props.desc == "string") {
    if (props.desc.length > trimSize) {
      text = props.desc.substring(0, trimSize - 5);
      text += "... ";
    }
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {props.title}
        </Typography>
        <Typography variant="h4" component="h2">
          {props.subjectCode}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {props.year + " - " + props.season}
        </Typography>
        <div style={{ minHeight: 70, maxHeight: 70, marginBottom: "20px" }}>
          <Typography paragraph variant="body2" component="p">
            {text}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={handleClick} variant="outlined" size="small">
          <b>Astral Site</b>
        </Button>
      </CardActions>
    </Card>
  );
}
