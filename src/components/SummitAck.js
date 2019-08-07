import React from 'react';
import TicketSummary from './TicketSummary';
import { Grid, Button, CircularProgress, Paper, Typography } from '@material-ui/core';

const SummitAck = props => {
    return (
        props.ticketNumber ?
            <Grid container direction={"column"} alignItems={"center"} spacing={16}>
                <Grid item md={12} style={{ width: "60%", padding: "3%" }}>
                    <TicketSummary {...props} />


                </Grid>
                <Grid item md={12} style={{ width: "47%", textAlign: "right" }}>
                    <Button onClick={props.resetFlow} variant={"contained"} color={"primary"} >
                        Nueva Solicitud
                    </Button>
                </Grid>
            </Grid>
            :
            <Paper style={{ display: "flex", 
            padding:"25px",
            margin:"10% 25%",
            flexDirection: "column", 
            justifyContent: "center", alignItems: "center" }}>
                <div>
                    <Typography color={"primary"} variant={"h5"}>
                        Estamos registrando tu Solicitud
                            </Typography>
                </div>
                <CircularProgress />
            </Paper>

    )
}
export default SummitAck;
