// Wrapper for all pages in the webapp.
import AstralAppBar from "./AstralAppBar.js";
import Head from "next/head";
import Router from "next/router";
import PageLoader from "./PageLoader.js";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { SnackbarProvider } from "notistack";
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';


const MyFont = createMuiTheme();
const MyFontTheme = responsiveFontSizes(MyFont);


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
	    <link rel="icon" type="image/x-icon" href="/logo_sm.png" />
          </Head>
          <PageLoader />
        </div>
      );
    }
    return (
      <div>
        <ThemeProvider theme={MyFontTheme} >
 
	      <SnackbarProvider maxSnack={3}>
          <Head>
            <title>Astral | Course Mangement System</title>
	    <link rel="icon" type="image/x-icon" href="/logo_sm.png" />
          </Head>
          <style jsx global>{`
            body {
              background: #fafafa;
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
        </SnackbarProvider>
</ThemeProvider>
</div>
    );
  }
}

export default App;
