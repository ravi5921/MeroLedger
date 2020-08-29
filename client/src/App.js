import React from "react";
import Home from "./components/Home";
import Menu from "./components/Menu";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import MainScreen from "./components/MainScreen";
import ExpenseScreen from "./components/ExpensesScreen";
import InvestScreen from "./components/InvestScreen";
import LoanScreen from "./components/LoanScreen";
import CurrentScreen from "./components/CurrentScreen";
import PastScreen from "./components/PastScreen";

const App = (props) => {
  const { route } = props;
  return (
    <BrowserRouter>
      {route === "/" ? <Home /> : <Menu />}
      <Switch>
        <Route exact path="/menu" render={(props) => <Menu {...props} />} />
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route
          exact
          path="/main"
          render={(props) => <MainScreen {...props} />}
        />
        <Route
          exact
          path="/expense"
          render={(props) => <ExpenseScreen {...props} />}
        />
        <Route
          exact
          path="/invest"
          render={(props) => <InvestScreen {...props} />}
        />
        <Route
          exact
          path="/loan"
          render={(props) => <LoanScreen {...props} />}
        />
        <Route
          exact
          path="/current"
          render={(props) => <CurrentScreen {...props} />}
        />
        <Route
          exact
          path="/past"
          render={(props) => <PastScreen {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
