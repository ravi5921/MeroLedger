import React, { useEffect, useState } from "react";
import {
  Typography,
  makeStyles,
  Box,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";
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
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      alignItems: "center",
    },
  },
  dateButton: {
    backgroundColor: "#000000",
    textTransform: "none",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
  },
  date: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  mainBox: {
    marginTop: theme.spacing(3),
  },
  topContent: {
    fontWeight: "bold",
    marginBottom: theme.spacing(3),
  },
  root: {
    maxWidth: "80%",
    marginLeft: "10%",
    backgroundColor: "#A8DADC",
    position: "relative",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
      marginLeft: 0,
    },
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
  cardContent: {
    paddingTop: theme.spacing(5),
  },
}));

//Main Function
const PastScreen = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUser] = useState({});
  const [loanData, setLoan] = useState({});
  const classes = useStyles();

  //Getting data from User Section
  useEffect(() => {
    async function fetchUserData() {
      const response1 = await fetch(`http://localhost:3001/users/${user.sub}`);
      const userData = await response1.json();
      const [userItem] = userData.main;
      setUser(userItem);
    }
    fetchUserData();
  });

  //Getting data from Loans section
  useEffect(() => {
    async function fetchUserData() {
      const response2 = await fetch(
        `http://localhost:3001/users/${user.sub}/Jul/loans`
      );
      const loanData = await response2.json();
      const [loanItem] = loanData;
      setLoan(loanItem);
    }
    fetchUserData();
  });

  const userSaving = userData.monthlyBudget - userData.expectedMonthlyExpenses;

  //Data for Varied Months
  function createData(months) {
    return { months };
  }

  const rows = [createData(1), createData(2), createData(3)];

  //Subtracting months
  function addMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }

  //Date Formatting Options
  const DATE_OPTIONS = {
    year: "numeric",
    month: "long",
  };

  return (
    isAuthenticated && (
      <main className={classes.content}>
        <div className={classes.drawerHeader} />
        {rows.map((row) => (
          <Box className={classes.content}>
            {/* Displays Date */}
            <Button variant="outlined" disabled className={classes.dateButton}>
              <Typography className={classes.date}>
                {addMonths(new Date(), row.months).toLocaleDateString(
                  "en-US",
                  DATE_OPTIONS
                )}
              </Typography>
            </Button>

            {/* Displays Card Contents */}
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography className={classes.captionText}>
                  Past Status
                </Typography>
                <Box className={classes.cardContent}>
                  <Typography className={classes.topContent}>
                    Salary : Rs. {userData.monthlyBudget}
                  </Typography>
                  <Typography className={classes.topContent}>
                    Monthly Expense : Rs. {userData.expectedMonthlyExpenses}
                  </Typography>
                  <Typography className={classes.topContent}>
                    Savings : Rs. {userSaving}
                  </Typography>
                  <Typography className={classes.topContent}>
                    Loan Taken : Rs. {loanData.loanTaken}
                  </Typography>
                  <Typography className={classes.topContent}>
                    Loan Given : Rs. {loanData.loanGiven}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </main>
    )
  );
};

export default PastScreen;
