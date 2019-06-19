import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import EngineerAvatar from './EngineerAvatar';
const TicketSummary = props => {
    const styleLineSpace = { marginBottom: "10px" };
    return (
        <div>
            <Paper style={{ marginLeft: "20%", marginRight: "20%", padding: '20px' }}>
                <EngineerAvatar />
                <Typography variant={"h6"} style={styleLineSpace} > Reporte Registrado  </Typography>
                <Typography variant={"h3"} style={styleLineSpace} color={"primary"} > {props.ticketNumber}   </Typography>
                <Typography variant={"h5"} style={styleLineSpace}> {props.category}   </Typography>
                <Typography variant={"subtitle1"} style={styleLineSpace}> {props.problem}   </Typography>
                <Typography variant={"body1"} style={styleLineSpace}> {props.detail}   </Typography>
               
            </Paper>
            
        </div>
    )
}

export default TicketSummary;

