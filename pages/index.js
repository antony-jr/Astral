import App from "../components/App.js";
import ClassCard from "../components/ClassCard.js";
import CourseClassSites from "../components/CourseClassSites.js";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "axios";

import {
  Typography,
  Container,
  Divider,
  Paper,
  Chip,
  Grid,
  Box
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
  const date = new Date();
  const currentYear = date.getFullYear();
  const season = date.getMonth() < 6 ? "Spring" : "Fall"; // Semester pattern.
  const loader = (
    <Paper
      square
      style={{
        minHeight: "300px",
        height: "100%",
        width: "100%"
      }}
    >
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
    </Paper>
  );
  const [classSiteYear, setClassSiteYear] = React.useState("");
  const [classSites, setClassSites] = React.useState([]);
  const [resultLoading, setResultLoading] = React.useState(false);
  const [results, setResults] = React.useState(
    <Paper
      square
      style={{
        backgroundPosition: "center",
	backgroundImage: `url(${"/classroom.jpg"})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "300px",
        height: "100%",
        width: "100%"
      }}
    >
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        direction="column"
        style={{ minHeight: "300px" }}
      >
	   <Grid item>
	<Typography align="center" variant="h1" style={{ color: "#000000" }}>
            {season} / {currentYear}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  React.useEffect(() => {
    axios.get("/api/getAcademicYear").then(({ data }) => {
      if (data.error) {
        setClassSiteYear("Unknown");
        console.log(data);
      } else {
        setClassSiteYear(
          data.fromAcademicYear.toString() +
            " - " +
            data.toAcademicYear.toString()
        );
      }
    });

    axios.get("/api/getClassSitesForFrontPage").then(({ data }) => {
      if (!data.error) {
        setClassSites(data.sites);
      }
    });
  }, []);

  const handleClick = cl => {
    setResultLoading(true);
    axios
      .get("/api/getCourseClasses", {
        params: {
          course: cl
        }
      })
      .then(({ data }) => {
        if (data.error) {
          setResultLoading(false);
        }
        setResults(<CourseClassSites data={data.data} />);
        setResultLoading(false);
      });
  };

  let render = (
    <div>
      <Typography variant="h4">
        Class Sites / <b>{classSiteYear}</b>
      </Typography>
      <Divider />
      <br />
      <Paper style={{ minHeight: "100px" }}>
        <br />
        <div style={{ marginLeft: "10%" }}>
          {classSites.map((cl, i) => (
            <Chip
              label={cl}
              style={{ marginLeft: "10px", marginTop: "10px", marginBottom: "10px"  }}
              onClick={() => {
                handleClick(cl);
              }}
              clickable
              color="default"
              key={i}
	     />
          ))}
        </div>
      </Paper>
      <br />
      {resultLoading ? loader : results}
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
      } else if (data.classes.length == 0) {
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
                  year={entry.year}
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
