import React, { useState, useEffect } from "react";
import {
  Typography,
  makeStyles,
  Box,
  Divider,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  Paper,
  TableCell,
  TextField,
  InputAdornment,
  Button,
  withStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import Async from "react-async";
import { useAuth0 } from "@auth0/auth0-react";

//Styles the Table
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 20,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

//Styles the Rows
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
  saveButton: {
    marginLeft: "40%",
    width: 120,
    height: 40,
    marginTop: 15,
    marginBottom: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#E63946",
    "&:hover": {
      backgroundColor: "#ED747E",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "28%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "30%",
    },
  },
  divider: {
    height: 2,
    backgroundColor: "#000000",
    marginBottom: theme.spacing(2),
  },
  root: {
    maxWidth: "90%",
    marginLeft: "5%",
    marginTop: theme.spacing(5),
    backgroundColor: "#A8DADC",
    marginBottom: theme.spacing(5),
    position: "relative",
  },

  captionText: {
    position: "absolute",
    top: 0,
    left: 0,
    fontSize: 20,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: "bold",
  },

  mainContent: {
    fontWeight: "bold",
    margin: theme.spacing(8),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      marginLeft: theme.spacing(4),
      fontSize: "0.90rem",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(5),
    },
  },
  contentBox: {
    marginLeft: theme.spacing(3),
    marginTop: -15,
    width: "70%",
    [theme.breakpoints.down("md")]: {
      width: "75%",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(3),
      width: "90%",
    },
  },
}));

//Main Function
const ExpenseScreen = () => {
  const { user, isAuthenticated } = useAuth0();
  const [iuser, setUser] = useState({});
  const classes = useStyles();

  //Getting data from Users section
  useEffect(() => {
    async function fetchUserData() {
      const response1 = await fetch(`http://localhost:3001/users/${user.sub}`);
      const data = await response1.json();
      const [item] = data.main;
      setUser(item);
    }
    fetchUserData();
  }, []);

  //Getting data from Expenses Section
  const loadContents = () =>
    fetch(`http://localhost:3001/users/${user.sub}/${iuser.month}/expenses`)
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => res.json());

  //Putting data in Expenses Section
  const fetchData = () => {
    fetch(`http://localhost:3001/users/${user.sub}/${iuser.month}/expenses`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titleOfExpense: values.titleOfExpense,
        amountSpent: values.amountSpent,
      }),
    });
  };

  //Sets values for expenses
  const [values, setValues] = React.useState({
    titleOfExpense: "",
    amountSpent: "",
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  //Date Formatting Options
  const DATE_OPTIONS = {
    year: "numeric",
    month: "short",
  };

  return (
    isAuthenticated && (
      <main className={classes.content}>
        <div className={classes.drawerHeader} />

        {/* Displays Topmost Content */}
        <Box className={classes.content}>
          <Box className={classes.mainBox}>
            <Typography className={classes.topContent}>
              Expected Expense for<span> </span>
              {new Date().toLocaleDateString("en-US", DATE_OPTIONS)} : Rs.{" "}
              {iuser && iuser.expectedMonthlyExpenses}
            </Typography>
            <Divider className={classes.divider} />

            {/* Displays Table Contents: Head and Body */}
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell align="right">
                      Amount&nbsp;(Rs.)
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <Async promiseFn={loadContents}>
                  {({ data, err, isLoading }) => {
                    if (isLoading) return "Loading...";
                    if (err) return `Something went wrong: ${err.message}`;

                    /* Displays Table Contents: Body */
                    if (data) {
                      return (
                        <TableBody>
                          {data.map((row) => (
                            <StyledTableRow key={row.titleOfExpense}>
                              <StyledTableCell component="th" scope="row">
                                {row.titleOfExpense}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {row.titleOfExpense === "Total"
                                  ? row.actualExpense
                                  : row.amountSpent}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      );
                    }
                  }}
                </Async>
              </Table>
            </TableContainer>

            {/* Displays Card Contents */}
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography className={classes.captionText}>
                  Add Expenses
                </Typography>
                <Typography className={classes.mainContent}>
                  TITLE :
                  <TextField
                    label="Expense Title"
                    id="outlined-start-adornment"
                    variant="outlined"
                    className={classes.contentBox}
                    value={values.titleOfExpense}
                    onChange={handleChange("titleOfExpense")}
                  />
                </Typography>
                <Typography className={classes.mainContent}>
                  AMOUNT :
                  <TextField
                    label="Amount"
                    id="outlined-start-adornment"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs. </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    value={values.amountSpent}
                    onChange={handleChange("amountSpent")}
                    className={classes.contentBox}
                  />
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.saveButton}
                  onClick={fetchData}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </main>
    )
  );
};

export default ExpenseScreen;
