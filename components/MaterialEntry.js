import {
  Button,
  Typography,
  IconButton,
  Divider,
  Paper,
  Container,
  Grid
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    flexGrow: 1,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.text.secondary
  }
}));

export default (props) => {
  const classes = useStyles();
  const [show, setShow] = React.useState(false);
  const [content, setContent] = React.useState(null)
  const [expandIcon, setExpandIcon] = React.useState(<ExpandMoreIcon />);
  const handleBtn = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
    return;
  };
  const handleExpandBtn = () => {
	  if(show){
		  setExpandIcon(<ExpandMoreIcon/>);
		  setShow(false);
	  }else{
		  setExpandIcon(<ExpandLessIcon/>);

		  // Get the content here.
		  setContent(<Typography paragraph>{props.description}</Typography>);
		  
		  setShow(true);
	  }
  }

  return (
   <Paper style={{marginTop: '5px'}} square elevation={5}>
	<Container width="lg">
	<Grid container direction="row" justify="flex-start" alignItems="center">
	<Typography className={classes.heading}>
		<b>{props.heading}</b>
	</Typography>
  	{props.showControl && 
		<IconButton size="sm" onClick={handleBtn} color="secondary">
              <DeleteIcon />
	      </IconButton>
	}
	<IconButton size="sm" color="secondary" onClick={handleExpandBtn}>
		{expandIcon}
	</IconButton>
      </Grid>
      {show && content }
      {show && <br/> }
      </Container>
   </Paper>
  );
}
