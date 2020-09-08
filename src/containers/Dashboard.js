import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import Chart from '../components/charts/Chart';
import { statusCodes } from '../constants'
const Dashboard = (props) => {

    return (
        <Grid container spacing={16}>
            <Grid item md={7}>
                <Paper>
                    <Chart feed={"graficapiedepartamentos"}
                        feedPayload={{ UsuarioLogin: props.usuario }}
                        hasGradient={true} />
                </Paper>
            </Grid>
            <Grid item md={5}>
                <Paper>
                    <Chart feed={"graficaareati"}
                        feedPayload={{ UsuarioLogin: props.usuario }}
                        hasGradient={true} />
                </Paper>
            </Grid>
            <Grid item md={12} container justify="space-between" >
                <Grid md={3} item>
                    <Paper>
                        <Chart feed={"graficagaugetickets"}
                            feedPayload={{ UsuarioLogin: props.usuario, Estatus: statusCodes.NEW.value }}
                            hasGradient={false} />
                    </Paper>
                </Grid>
                <Grid md={3} item >
                    <Paper>
                        <Chart feed={"graficagaugetickets"}
                            feedPayload={{ UsuarioLogin: props.usuario, Estatus: statusCodes.IN_PROCESS.value }}
                            hasGradient={false} />
                    </Paper>
                </Grid>
                {/*
                    <Grid md={3} item >
                        <Paper>
                            <Chart feed={"graficagaugetickets"}
                                feedPayload={{ UsuarioLogin: props.usuario, Estatus: statusCodes.THIRD.value }}
                                hasGradient={false} />
                        </Paper>
                    </Grid>
                */}
                <Grid md={3} item >
                    <Paper>
                        <Chart feed={"graficagaugetickets"}
                            feedPayload={{ UsuarioLogin: props.usuario, Estatus: statusCodes.SOLVED.value }}
                            hasGradient={false} />
                    </Paper>
                </Grid>
                <Grid md={3} item >
                    <Paper>
                        <Chart feed={"graficagaugetickets"}
                            feedPayload={{ UsuarioLogin: props.usuario, Estatus: statusCodes.REJECTED.value }}
                            hasGradient={false} />
                    </Paper>
                </Grid>
            </Grid>


        </Grid>
    )

}
export default Dashboard;
