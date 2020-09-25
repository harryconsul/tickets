import React from 'react';
import { Grid, Paper, Button } from '@material-ui/core'
import Microsoft from 'mdi-material-ui/Microsoft';
import ti911 from '../assets/ti911.png';
import dicipa from '../assets/logo-dicipa-login.png';
import CircularProgress from '@material-ui/core/CircularProgress';

const Login = (props) => {
    return (
        <Paper style={{ width: "50%", margin: "10% 25% 30% 25%", height: "50%", padding: "20px" }}>
            <Grid container direction="column" alignItems={"center"}
                wrap="nowrap" style={{ height: "100%" }} justify={"center"}
                spacing={1}>
                <Grid item style={{ marginBottom: "15px" }}>
                    <img alt="Servicios TI" src={ti911} width="367" height="156"/>
                </Grid>

                <Grid item style={{ marginBottom: "15px" }}>
                    {props.isLoading ?
                        <CircularProgress />
                        :
                        <Button variant={"contained"} color={"primary"} style={{ fontSize: "1.5rem" }}
                            onClick={props.login}>

                            <Microsoft /> Entrar
                        </Button>
                    }
                </Grid>
                <Grid item container direction="column" alignItems={"flex-end"}>
                    <Grid item>
                        <img alt="DICIPA" src={dicipa} width="80" height="56" />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );

}

export default Login;
