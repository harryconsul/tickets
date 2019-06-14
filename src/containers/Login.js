import React from 'react';
import {Grid,Paper,Typography,Button,TextField}  from '@material-ui/core'
import {connect} from 'react-redux';
import * as userActions from '../actions/user.actions';

const styleInput = {width:"60%",marginBottom:"20px"}
class Login extends React.Component{
    state={
        user:"",
        password:"",
    }
    handleChange=(event)=>{
     
        this.setState({[event.target.name]:event.target.value});
    }
    handleLogin=()=>{
        this.props.dispatch(userActions.actionLogin({username:this.state.user}))
        this.props.history.push("/usuario");

    }
    render(){
        const {user,password} = this.state;
        const disabled=(user==='' || password==='');

        return(
            <Paper style={{width:"50%",margin:"10% 25% 30% 25%",height:"50%",padding:"20px"}}>
                <Grid container direction="column" alignItems={"center"} 
                    wrap="nowrap" style={{height:"100%"}}
                spacing={16}>
                    <Grid item style={{marginBottom:"10px"}} >
                        <Typography variant={"h3"}> Iniciar Sesión</Typography>
                    </Grid>
                    <Grid item style={styleInput} >
                        <TextField label={"Usuario"} value={user} onChange={this.handleChange}
                            name={"user"} fullWidth/>
                    </Grid>
                    <Grid item  style = {styleInput}>
                        <TextField label={"Contraseña"}  value ={password} onChange={this.handleChange}
                            name={"password"} fullWidth  type={"password"}/>
                    </Grid>
                    <Grid item >
                        <Button variant={"contained"} color={"primary"}  
                            onClick={this.handleLogin}
                        disabled={disabled} >Entrar</Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}
const mapStateToProps=state=>{
    return {user:state.user};
}
export default connect(mapStateToProps)(Login);
