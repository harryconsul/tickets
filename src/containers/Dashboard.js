import React from 'react';
import {Grid,Paper} from '@material-ui/core';
import Chart from '../components/charts/Chart';
import {statusCodes} from '../constants'
const Dashboard = (props)=>{

    return(
        <Grid container spacing={16}>
            <Grid item md={7}>
                <Paper> 
                    <Chart feed = {"graficapiedepartamentos"} 
                        hasGradient={true} />
                </Paper>
            </Grid>            
            <Grid item md={5}>
                <Paper>
                <Chart feed = {"graficaareati"} 
                        hasGradient={true} />
                </Paper>
            </Grid>
            <Grid item md={3}>
                <Paper>
                <Chart feed = {"graficagaugetickets"}
                     feedPayload={{Estatus:statusCodes.NEW.value}}
                        hasGradient={false} />
                </Paper>
            </Grid>
            <Grid item md={3}>
                <Paper>
                <Chart feed = {"graficagaugetickets"}
                     feedPayload={{Estatus:statusCodes.IN_PROCESS.value}}
                        hasGradient={false} />
                </Paper>
            </Grid>
            <Grid item md={3}> 
                <Paper>
                <Chart feed = {"graficagaugetickets"}
                     feedPayload={{Estatus:statusCodes.REJECTED.value}}
                        hasGradient={false} />
                </Paper>
            </Grid>
            <Grid item md={3}>
                <Paper>
                <Chart feed = {"graficagaugetickets"}
                     feedPayload={{Estatus:statusCodes.SOLVED.value}}
                        hasGradient={false} />
                </Paper>
            </Grid>

        </Grid>
    )

}
export default Dashboard;
