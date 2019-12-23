import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  loginButton: {
    marginLeft: theme.spacing(2)
  },
  logoSm: {
    maxWidth: 60,
    maxHeight: 60,
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  logo: {
    maxWidth: 140,
    maxHeight: 45,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  appBar: {
    backgroundColor: "rgba(256,256,256,1)"
  },
  title: {
    flexGrow: 1,
    color: fade(theme.palette.common.black, 0.95),
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    marginTop: theme.spacing(1)
  },
  searchGrid: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0
    }
  },
  search: {
    width: "100%",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25)
    },
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: fade(theme.palette.common.black, 0.84)
  },
  inputRoot: {
    width: "100%"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width")
  }
}));

export default function AstralAppBar(props) {
  const classes = useStyles();

  return (
    <div>
      <HideOnScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <img src="logo.png" alt="logo" className={classes.logo} />
            <img src="logo_sm.png" alt="logo" className={classes.logoSm} />
            {/*<Typography className={classes.title} variant="h5" noWrap>
		  Astral
		  </Typography>*/}

            <Grid
              container
              direction="row"
              justify="center"
              className={classes.searchGrid}
            >
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </Grid>
            <Button
              color="default"
              variant="outlined"
              className={classes.loginButton}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </div>
  );
}
