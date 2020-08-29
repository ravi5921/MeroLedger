import React, { useState, useEffect } from "react";
import {
  Typography,
  makeStyles,
  Box,
  Divider,
  Grid,
  CardActionArea,
  CardActions,
  CardMedia,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";
import Async from "react-async";
import { useAuth0 } from "@auth0/auth0-react";

//Material-UI Formatting
const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(25),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(15),
    [theme.breakpoints.down("md")]: {
      paddingLeft: theme.spacing(18),
      paddingRight: theme.spacing(8),
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(3),
    },
  },
  topContent: {
    fontWeight: "bold",
    marginBottom: theme.spacing(3),
  },

  divider: {
    height: 2,
    backgroundColor: "#000000",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
    paddingBottom: 40,
    textAlign: "center",
  },
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 200,
  },
  cardCaption: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: "black",
    color: "#fff",
    opacity: 0.8,
    height: 10,
    padding: 0,
  },
  captionText: {
    paddingTop: 7,
    marginLeft: 7,
  },
  button: {
    width: "100%",
    textAlign: "center",
  },
}));

//Requests data from this API
const loadContents = () =>
  fetch(`http://localhost:3001/investments`)
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .then((res) => res.json());

//Main Function
const InvestScreen = () => {
  const { user, isAuthenticated } = useAuth0();
  const [iuser, setUser] = useState({});

  //Getting Data from Users Section
  useEffect(() => {
    async function fetchUserData() {
      const response1 = await fetch(`http://localhost:3001/users/${user.sub}`);
      const data = await response1.json();
      const [item] = data.main;
      setUser(item);
    }
    fetchUserData();
  }, []);
  const classes = useStyles();

  //Date Formatting Options
  const DATE_OPTIONS = {
    year: "numeric",
    month: "short",
  };

  return (
    isAuthenticated && (
      <main className={classes.content}>
        <div className={classes.drawerHeader} />
        <Box className={classes.content}>
          <Box>
            {/* Displays the top content */}
            <Typography className={classes.topContent}>
              Expected Saving for<span> </span>
              {new Date().toLocaleDateString("en-US", DATE_OPTIONS)} : Rs.{" "}
              {iuser && iuser.expectedMonthlySaving}
            </Typography>
            <Divider className={classes.divider} />
            <Typography variant="h5" className={classes.title}>
              Investment Options
            </Typography>

            {/* Loads the data from API */}
            <Async promiseFn={loadContents}>
              {({ data, err, isLoading }) => {
                if (isLoading) return "Loading...";
                if (err) return `Something went wrong: ${err.message}`;

                /* Displays Card Contents */
                if (data)
                  return (
                    <Grid container spacing={3}>
                      {data.map((row) => (
                        <Grid item xs={12} sm={6}>
                          <Card className={classes.root}>
                            <CardActionArea>
                              <CardMedia
                                className={classes.media}
                                image={row.image}
                                title={row.title}
                              >
                                <CardContent className={classes.cardCaption}>
                                  <Typography className={classes.captionText}>
                                    {row.title}
                                  </Typography>
                                </CardContent>
                              </CardMedia>
                            </CardActionArea>
                            <CardActions>
                              <Button
                                size="small"
                                color="primary"
                                className={classes.button}
                                href={row.link}
                                target="_blank"
                              >
                                View Available Options
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  );
              }}
            </Async>
          </Box>
        </Box>
      </main>
    )
  );
};

export default InvestScreen;
