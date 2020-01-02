import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
	  width: '100%',
	  backgroundColor: theme.palette.background.paper,
  },
  item: {
 
  },
	 inline: {
		 display: 'inline',
		 color: 'black',
  },
}));

export default function CourseClassSites(props) {
  const classes = useStyles();
  const results = typeof props.data == 'undefined' ? [] : props.data;
	return (
    <List className={classes.root} >
	    {results.map((value, iter) => 
	    <ListItem divider divider={true}>
	      <ListItemText className={classes.item} 
 secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="h6"
                className={classes.inline}
                color="inherit"
	>{		value.title}
		<br/>
	      </Typography>
	      <Typography variant="body1" >{value.description}</Typography>
	      <br/>
	      <Grid container direction="row" justify="flex-end" alignItems="center" style={{width:'100%'}}>
		      <Button variant="outlined" color="default" onClick={()=> {window.location.href = value.location} }>Astral Site</Button> 
	      </Grid>
		 </React.Fragment>
          }
		  primary={value.instructor} />
      </ListItem>
	    )}
</List>
  );
}
