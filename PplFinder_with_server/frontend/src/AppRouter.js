import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home ,Fav} from "pages";
import { ThemeProvider } from "theme";
import NavBar from "components/NavBar";

const AppRouter = () => {
  return (
    <ThemeProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/fav" component={Fav} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
