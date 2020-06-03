import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NotFound from './views/notFound/NotFound';
import Root from './views/root/Root';
import Main from './views/main/Main';
import Room from './views/room/Room';
import Add from './views/add/Add';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Root}/>
        <Route exact path="/notFound" component={NotFound}/>
        <Route exact path="/:id" component={Main}/>
        <Route exact path="/add/:id" component={Add}/>
        <Route exact path="/room/:id" component={Room}/>
        <Route path="*" component={NotFound}/>
      </Switch>
    </Router>
  );
}

export default App;
