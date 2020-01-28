import React from 'react';
import {Grid,Paper,Button}  from '@material-ui/core'
import Microsoft from 'mdi-material-ui/Microsoft';
import  seva from '../assets/seva.png'
import CircularProgress from '@material-ui/core/CircularProgress';

const Login = (props)=>{
        return(
            <Paper style={{width:"50%",margin:"10% 25% 30% 25%",height:"50%",padding:"20px"}}>
                <Grid container direction="column" alignItems={"center"} 
                    wrap="nowrap" style={{height:"100%"}} justify={"center"}
                spacing={32}>
                    <Grid item>
                        <img alt="Servicios TI" src={} />
                    </Grid>
                                       
                    <Grid item >
                        {props.isLoading?
                        <CircularProgress/>
                        :
                        <Button variant={"contained"} color={"primary"}   style={{fontSize:"1.5rem"}}
                            onClick={props.login}>

                            <Microsoft /> Entrar
                        </Button>
                        }
                    </Grid>
                   
                    
                </Grid>
            </Paper>
        );
    
}

export default Login;
