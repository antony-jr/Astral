// Wrapper for all pages in the webapp.
import AstralAppBar from "./AstralAppBar.js";
import Head from "next/head";
import Router from "next/router";
import PageLoader from "./PageLoader.js";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 3000);
  }
  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <Head>
            <title>Astral | Course Mangement System</title>
            <link rel="icon" type="image/x-icon" href="logo_sm.png" />
          </Head>
          <PageLoader />
        </div>
      );
    }
    return (
      <div>
        <Head>
          <title>Astral | Course Mangement System</title>
          <link rel="icon" type="image/x-icon" href="logo_sm.png" />
        </Head>
        <style jsx global>{`
          body {
            background: #f2f2f2;
          }
        `}</style>
        <Grid
          container
          direction="column"
          justify="flex-start"
          style={{ flexGrow: 1 }}
        >
          <AstralAppBar
            userLogged={this.props.userLogged}
            username={this.props.username}
          />
          <Container maxWidth="lg" style={{ marginTop: "80px" }}>
            {this.props.payload}
          </Container>
        </Grid>
      </div>
    );
  }
}

export default App;
