import React from 'react';
import { Paper, Avatar, Typography, Grid } from '@material-ui/core'
import CalendarClock from 'mdi-material-ui/CalendarClock';
class Comment extends React.Component {
    shouldComponentUpdate(){
        return false;
    }
    render() {
        return (
            <Grid container style={{ marginBottom: "10px" }} >
                <Grid item md={1}>
                    <Avatar>{this.props.avatar}</Avatar>
                </Grid>
                <Grid item md={11}>
                    <Paper style={{ padding: "10px" }}>
                        <Grid container>
                            <Grid item md={8}> <Typography variant={"h6"}> {this.props.author} </Typography></Grid>
                            <Grid item md={4} style={{ display: "inline-flex" }}> <CalendarClock />  <Typography variant={"caption"}>{this.props.date}</Typography> </Grid>
                            <Grid item md={10}><Typography variant={"body1"}> {this.props.comment} </Typography> </Grid>
                        </Grid>
                    </Paper>
                </Grid>

            </Grid>

        )
    }
}
export default Comment;
