import React from 'react';
import {Grid,Paper,Typography,Button}  from '@material-ui/core'
import Microsoft from 'mdi-material-ui/Microsoft';
import CircularProgress from '@material-ui/core/CircularProgress';

const Login = (props)=>{
        return(
            <Paper style={{width:"50%",margin:"10% 25% 30% 25%",height:"50%",padding:"20px"}}>
                <Grid container direction="column" alignItems={"center"} 
                    wrap="nowrap" style={{height:"100%"}}
                spacing={16}>
                    <Grid item style={{marginBottom:"10px"}} >
                        <Typography variant={"h3"}> Iniciar Sesión</Typography>
                    </Grid>
                    
                    <Grid item >
                        {props.isLoading?
                        <CircularProgress/>
                        :
                        <Button variant={"contained"} color={"primary"}  
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
