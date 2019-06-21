import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';
import hello from 'hellojs';
import {UserAgentApplication} from 'msal';
 
import GraphSdkHelper from './helpers/GraphSdkHelper';
import { applicationId,graphScopes } from './helpers/config';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {actionLogin} from './actions/user.actions';

class App extends React.Component {
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
    if(this.userAgentApplication.getAccount()){

      this.getUserProfile();
    }else{
      if(this.props.user){
        this.props.dispatch(actionLogin(null));
      }
    }
  }
  
  getUserProfile=async()=> {
    try {
      
      console.log("scopes", graphScopes);
      var accessToken = await this.userAgentApplication.acquireTokenSilent(graphScopes);
  
      if (accessToken) {
        
        
        this.graphClient  = new GraphSdkHelper(accessToken.accessToken);
        this.graphClient.getMyProfile((err,me)=>{
          console.log("length",me.id.length);
          const user ={
            id:me.id,
            department:me.department,
            mail: me.mail,
            username:me.mail.replace("@dicipa.com.mx",""),
            displayName: me.displayName
          }
          this.props.dispatch(actionLogin(user));
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
const mapStateToProps=state=>{
  return {user:state.user};
}
export default connect(mapStateToProps)(App)