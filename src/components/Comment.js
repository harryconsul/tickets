import React from 'react';
import { Paper, Avatar, Typography, Grid } from '@material-ui/core'
import CalendarClock  from 'mdi-material-ui/CalendarClock';
const Comment = props => {

    return (
        <Grid container style={{marginBottom:"10px"}} >
            <Grid item md={1}>
                <Avatar>{props.avatar}</Avatar>
            </Grid>
            <Grid item md={11}>
                <Paper style={{ padding: "10px"}}>
                    <Grid container>
                        <Grid item md={8}> <Typography variant={"h6"}> {props.author} </Typography></Grid>
                        <Grid item md={4} style={{display:"inline-flex"}}> <CalendarClock />  <Typography variant={"caption"}>{props.date}</Typography> </Grid>
                        <Grid item md={10}><Typography variant={"body1"}> {props.comment} </Typography> </Grid>
                    </Grid>
                </Paper>
            </Grid>

        </Grid>

    )

}
export default Comment;
