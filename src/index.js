import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import 'typeface-roboto';
import { Provider } from 'react-redux';
import store from './store/store';
axios.defaults.baseURL = "https://ti911.dicipa.com.mx:3001/rest/";
//axios.defaults.baseURL = "http://localhost/Tickets.NetEnvironment/rest/";

axios.defaults.headers.post['Content-Type'] = 'application/json';



const theme = createMuiTheme({
  palette: {
    type: 'light',
    text: {
      primary:"#5d5858",
      secondary: "black",
      third:"white"
    },
    secondary: {
      light: "#8e92d3",
      dark: "#8a8ed8",
      main: "#ff4081"

    }

  },
  typography: {
    useNextVariants: true,
  },
});
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme} >
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'));

//var root = document.getElementById("root");
//console.log(theme);
document.body.setAttribute("style", "background-color:" + theme.palette.background.default);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
