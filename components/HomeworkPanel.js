import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Button,
  Typography,
  IconButton
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
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

export default function HomeworkPanel(props) {
  const classes = useStyles();
  const handleBtn = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
    return;
  };
  return (
    <ExpansionPanel style={{width: '100%'}} expanded={props.expanded} onChange={props.onChange}>
	    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
	<Typography className={classes.heading}>
		<b>{props.heading}</b> (Due {(new Date(props.deadline)).toDateString()})
		</Typography>
	{props.showControl && 
	<IconButton size="sm" onClick={handleBtn} color="secondary">
              <DeleteIcon />
      </IconButton> } 
</ExpansionPanelSummary>
      {props.expanded && props.payload}
    </ExpansionPanel>
  );
}
