import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';

import hello from 'hellojs';
import {UserAgentApplication} from 'msal';

 
import GraphSdkHelper from './helpers/GraphSdkHelper';
import { applicationId, redirectUri,graphScopes } from './helpers/config';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    // Initialize the auth network.
    const msalConfig = {
      auth: {
        clientId: applicationId, // Client Id of the registered application        
      },
    };
    
    this.userAgentApplication = new UserAgentApplication(msalConfig,null,null);
    
    this.state = {
      isAuthenticated: false,
      user:{},
      access:"",
      error:{},
    };
  }

  componentDidMount(){
    if(this.userAgentApplication.account){
      
      this.getUserProfile();
    }
  }
  
  getUserProfile=async()=> {
    try {
      
      console.log("scopes", graphScopes);
      var accessToken = await this.userAgentApplication.acquireTokenSilent(graphScopes);
  
      if (accessToken) {
        
        
        this.graphClient  = new GraphSdkHelper(accessToken.accessToken);
        this.graphClient.getMyProfile((err,me)=>{
          console.log(me);
        })

        this.setState({
          isAuthenticated: true,         
          
        });
      }
    }
    catch(err) {
      console.log("error on getting token",err) ;
  
    }
  }

  // Sign the user into Azure AD. HelloJS stores token info in localStorage.hello.
  login= async  ()=> {
    try {
      await this.userAgentApplication.loginPopup(graphScopes);
      await this.getUserProfile();

      
    }
    catch(err) {
      console.log(err);
      
    }
  }

  // Sign the user out of the session.
  logout=() =>{ 
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
        <Route exact path="/" component={()=><Login login={this.login} />} />
        <Route path="/admin/" component={Admin} />
        
        <Route path="/usuario/" component={User} />
        

      </Router>
    );
  }
}
