import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Root from './views/root/Root';
import Main from './views/main/Main';
import Room from './views/room/Room';
import Add from './views/add/Add';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Root}/>
        <Route exact path="/:id" component={Main}/>
        <Route exact path="/add/:id" component={Add}/>
        <Route exact path="/room/:id" component={Room}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
