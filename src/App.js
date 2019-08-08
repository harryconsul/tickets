import React from 'react';
import './App.css';
import User from './containers/User';
import Admin from './containers/Admin'
import Login from './containers/Login';
import { UserAgentApplication } from 'msal';

import GraphSdkHelper from './helpers/GraphSdkHelper';
import { applicationId, graphScopes } from './helpers/config';

import { Router } from 'react-router-dom';
import { connect } from 'react-redux';

import { actionLogin, actionGetCatalogs } from './actions/user.actions';
import axios from 'axios';
import {history} from './helpers/history';

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

  savePreference = (username) =>{
    //Cuando un admin, de alta tickets es posible auto-asignarse el ticket.
    const data = {
        UsuarioLogin: username,
        operacion:"U",
        key:"auto-asignar-solicitud",
        value:'N',
    };

    axios.post("trabajarpreferencias",data).then(response=>{
        console.log(response.data);
    }).catch(reason=>{
        console.log(reason);
    })
}

  getUserProfile = async () => {
    try {


      var accessToken = await this.userAgentApplication.acquireTokenSilent(graphScopes);

      if (accessToken) {
        this.graphClient = new GraphSdkHelper(accessToken.accessToken);
        this.graphClient.getMyProfile((err, me) => {

          const user = {
            accessToken: accessToken.accessToken,
            id: me.id,
            department: me.department,
            email: me.mail,
            username: me.mail.replace("@dicipa.com.mx", ""),
            name: me.displayName,
            logout: this.userAgentApplication.logout.bind(this.userAgentApplication),


          }

          this.props.dispatch(actionGetCatalogs(user.username));

          const registrarUsuario = new Promise((resolve, reject) => {
            axios.post("registrausuario", { user })
              .then(response => {
                const perfil = response.data.Perfil;
                user.profile = perfil;

                //A= Administrador , S = Supervisor
                if (perfil === 'A' || perfil === 'S') {
                  user.isManager = true;
                  this.savePreference(user.username);

                } else {
                  user.isManager = false;
                }

                resolve(user);
              })
              .catch(error => {
                reject(error);
              });
          });

          const myPicture = new Promise((resolve, reject) => {
            this.graphClient.getMyPicture((err, response) => {
              if (!err && response) {
                user.photo = response;
                resolve(user);
              } else {
                resolve(user);
              }
            })
          });

          Promise.all([registrarUsuario, myPicture])
            .then(values => {
              //Setear los datos del usuario Redux.
              this.props.dispatch(actionLogin(user))
            });

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

  render() {

    return (
      //<Router basename="/Tickets/R" >
      <Router history={history} >

        {this.props.user ?

          (this.props.user.isManager ?
            <Admin /> :
            <User />)
          : (
            <React.Fragment>

              <Login login={this.login} isLoading={this.state.isLoading} />
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