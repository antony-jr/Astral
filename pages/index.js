import App from "../components/App.js";
import ClassCard from "../components/ClassCard.js";

import axios from "axios";

import {
  Typography,
  Container,
  Divider,
  Paper,
  Chip,
  Grid
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import siteConfig from "../siteConfig.json";

const useStyles = makeStyles(theme => ({
  userPageRoot: {
    ...theme.typography.button,
    backgroundColor: "#f44336",
    color: "#ffffff",
    padding: theme.spacing(1)
  }
}));

function PublicPage() {
  let render = (
    <div>
      <Typography variant="h4">
        Class Sites / <b>2020 - 2021</b>
      </Typography>
      <Divider />
      <br />
      <Paper style={{ minHeight: "100px" }}>
        <br />
        <div style={{ marginLeft: "10%" }}>
          <Chip label="CSE-R17" clickable color="secondary" />
        </div>
      </Paper>
    </div>
  );
  return <App userLogged={false} payload={render} />;
}

function UserPage(props) {
  const classes = useStyles();
  const [content, setContent] = React.useState(null);
  React.useEffect(() => {
    axios.get("/api/getClasses").then(({ data }) => {
      if (data.error) {
        setContent(
          <div className={classes.userPageRoot}>
            Cannot connect to backend, Please contact the administrator.
          </div>
        );
        return;
      } else if (data.length == 0) {
        setContent(
          <div className={classes.userPageRoot}>
            You have no classes assigned, Please contact your administrator if
            you think this is a fault.
          </div>
        );
      } else {
        setContent(
          <Grid container direction="row" justify="flex-start" spacing={2}>
            {data.classes.map((entry, iter) => (
              <Grid item>
                <ClassCard
                  location={entry.location}
                  title={entry.title}
                  subjectCode={entry.subjectCode}
                  season={entry.season}
                  desc={entry.desc}
                />
              </Grid>
            ))}
          </Grid>
        );
      }
    });
  }, []);

  let render = (
    <div>
      <Typography variant="h4">
        {props.legalName} / <b>Dashboard</b>
      </Typography>
      <Divider />
      <br />
      {content}
    </div>
  );
  return <App userLogged={true} username={props.username} payload={render} />;
}

function Page() {
  const [session, setSession] = React.useState(null);
  React.useEffect(() => {
    axios.get("/api/getSession").then(({ data }) => {
      setSession(data);
    });
  }, []);

  if (session && session.userLogged) {
    if (session.username != "administrator") {
      return (
        <UserPage username={session.username} legalName={session.legalName} />
      );
    } else {
      // redirect to control panel
      window.location.href = "/administrator-panel";
    }
  } else {
    return <PublicPage />;
  }
}

export default Page;
