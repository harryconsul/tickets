import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';

import hello from 'hellojs';
import GraphSdkHelper from './helpers/GraphSdkHelper';
import { applicationId, redirectUri } from './helpers/config';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    // Initialize the auth network.
    hello.init({
      aad: {
        name: 'Azure Active Directory',	
        oauth: {
          version: 2,
          auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        },
        form: false
      }
    });
    
    // Initialize the Graph SDK helper and save it in the window object.
    this.sdkHelper = new GraphSdkHelper({ login: this.login.bind(this) });
    window.sdkHelper = this.sdkHelper;

    // Set the isAuthenticated prop and the (empty) Fabric example selection. 
    this.state = {
      isAuthenticated: !!hello('aad').getAuthResponse(),
      example: ''
    };
  }

  // Get the user's display name.
  componentWillMount() {
    if (this.state.isAuthenticated) {
      this.sdkHelper.getMe((err, me) => {
        if (!err) {
          this.setState({
            displayName: `Hello ${me.displayName}!`
          });
        }
      });

      this.sdkHelper.getMyProfile((err,me) => {
        if(!err){
          console.log(me);
          console.log("Department: " , me.department);
          console.log("Mail: " , me.mail);
          console.log("Phone: " , me.mobilePhone);
        }
      })
    }
  }

  // Sign the user into Azure AD. HelloJS stores token info in localStorage.hello.
  login() {

    // Initialize the auth request.
    hello.init( {
      aad: applicationId
      }, {
      redirect_uri: redirectUri,
      scope: 'user.readbasic.all+mail.send+files.read'
    });

    hello.login('aad', { 
      display: 'page',
      state: 'abcd'
    });
  }

  // Sign the user out of the session.
  logout() { 
    hello('aad').logout();
    this.setState({ 
      isAuthenticated: false,
      example: '',
      displayName: ''
    });
  }

  render(){
   
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
}
