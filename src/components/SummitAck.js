import React from 'react';
import TicketSummary from './TicketSummary';
import { Grid, Button } from '@material-ui/core';
const SummitAck = props => {
    return (
        <Grid container direction={"column"} alignItems={"center"} spacing={16}>
            <Grid item md={12} style={{width:"80%"}}>
                <TicketSummary {...props} />
            </Grid>
            <Grid item md={12} style={{width:"47%",textAlign:"right"}}>
                <Button onClick={props.resetFlow} variant={"contained"} color={"primary"} >
                    Nueva Solicitud
                </Button>
            </Grid>
        </Grid>
    )
}
export default SummitAck;
