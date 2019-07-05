import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';
import hello from 'hellojs';
import { UserAgentApplication } from 'msal';

import GraphSdkHelper from './helpers/GraphSdkHelper';
import { applicationId, graphScopes, redirectUri } from './helpers/config';

import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { actionLogin } from './actions/user.actions';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the auth network.
    const msalConfig = {
      auth: {
        clientId: applicationId, // Client Id of the registered application  

      },
    };

    this.userAgentApplication = new UserAgentApplication(msalConfig, null, null);

    this.state = {
      isLoading: false
    }

  }

  componentDidMount() {
    if (this.userAgentApplication.getAccount()) {

      //El siguiente state, se usa para mostrar el icono progress en el componente Login.js
      this.setState({
        isLoading: true
      });
      
      this.getUserProfile();
    } else {
      if (this.props.user) {
        this.props.dispatch(actionLogin(null));
      }
    }
  }

  getUserProfile = async () => {
    try {


      var accessToken = await this.userAgentApplication.acquireTokenSilent(graphScopes);

      if (accessToken) {
        console.log("access",accessToken);

        this.graphClient = new GraphSdkHelper(accessToken.accessToken);
        this.graphClient.getMyProfile((err, me) => {

          const user = {
            accessToken:accessToken.accessToken,
            id: me.id,
            department: me.department,
            email: me.mail,
            username: me.mail.replace("@dicipa.com.mx", ""),
            name: me.displayName,
            isManager: true,//me.department==="TI",
            logout: this.userAgentApplication.logout.bind(this.userAgentApplication),
            

          }
          axios.post("registrausuario", { user }).then(response => {

          }).catch(error => {
            console.log(error);
          });

          this.graphClient.getMyPicture((err, response) => {
            if (!err && response) {
              user.photo=response;
              this.props.dispatch(actionLogin(user));
              


            } else {
              console.log("error",err,"response",response)
              this.props.dispatch(actionLogin(user));
            }
          })

        })





      }
    }
    catch (err) {
      console.log("error on getting token", err);

    }
  }

  // Sign the user into Azure AD. HelloJS stores token info in localStorage.hello.
  login = async () => {
    try {
     
      await this.userAgentApplication.loginPopup(graphScopes);

      //El siguiente state, se usa para mostrar el icono progress en el componente Login.js
      this.setState({
        isLoading: true
      });

      await this.getUserProfile();


    }
    catch (err) {
      console.log(err);

    }
  }

  // Sign the user out of the session.
  logout = () => {
    hello('aad').logout();
  }

  render() {

    return (
      //<Router basename="/Tickets/R" >
      <Router  >

        {this.props.user ?

          (this.props.user.isManager ?
             <Admin /> :
              <User />)
          : (
            <React.Fragment>
              
              <Login login={this.login} isLoading={this.state.isLoading}/>
            </React.Fragment>
          )



        }


      </Router>
    );
  }
}
const mapStateToProps = state => {
  return { user: state.user };
}
export default connect(mapStateToProps)(App)