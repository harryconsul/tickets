import React from 'react';
import { Typography, TextField, Grid,  Button } from '@material-ui/core';
import DateIcon from 'mdi-material-ui/CalendarRange'
import axios from 'axios';

const PromiseDate = (props) => {
    const [date, updateDate] = React.useState(props.promiseDate);
    const [isEditing, setIsEditing] = React.useState(props.promiseDate === "0000-00-00" ? true : false);
    const submitPromiseDate = () => {
        axios.post("registrafechacompromiso", { date,SolicitudId:props.id }).then((response) => {
                setIsEditing(false);
                props.changePromiseDate(date);
        });
    }
    return (
       
            <Grid container direction={"column"} >
                <Grid>
                    <Typography variant={"subtitle2"}> Fecha Compromiso</Typography>
                </Grid>
                <Grid container direction="row" justify={"space-between"} >
                    {isEditing ? <React.Fragment>
                        <Grid item>
                            <TextField name="promisedate" type="date"
                                onChange={(event) => updateDate(event.target.value)} />

                        </Grid>
                        <Grid item>
                            <Button color="primary" onClick={submitPromiseDate}
                                 disabled={date==="0000-00-00"}
                                variant={"outlined"} >
                                <DateIcon />
                            </Button>
                        </Grid>
                    </React.Fragment>
                        : <Grid>
                            <Typography>
                                {date}
                            </Typography>
                        </Grid>
                    }



                </Grid>


            </Grid>
        


    )
}
export default PromiseDate;