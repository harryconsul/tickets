import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button'
function App() {
  return (
    <Router>
      <Button>
        <Link to={"/admin"}>
          Administrar
          </Link>
      </Button>
      <Button>
        <Link to={"/usuario"}>
          Alta
          </Link>
      </Button>
      <Route exact path="/" component={Login} />
      <Route path="/admin/" component={Admin} />
      
      <Route path="/usuario/" component={User} />
      

    </Router>
  );
}

export default App;
