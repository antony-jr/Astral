import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Button,
  Typography
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.text.secondary
  }
}));

export default function ControlPanel(props) {
  const classes = useStyles();
  return (
    <ExpansionPanel expanded={props.expanded} onChange={props.onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          <b>{props.heading}</b>
        </Typography>
      </ExpansionPanelSummary>
      {props.expanded && props.payload}
    </ExpansionPanel>
  );
}
