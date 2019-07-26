import React from 'react';
import { Typography, TextField, Grid,  Button } from '@material-ui/core';
import DateIcon from 'mdi-material-ui/CalendarRange'
import axios from 'axios';

const PromiseDate = (props) => {
    const [date, updateDate] = React.useState(props.promiseDate);
    const [isEditing, setIsEditing] = React.useState(props.promiseDate === "" ? true : false);
    const submitPromiseDate = () => {
     
        const _formatedDate = date.replace("T"," ")
        console.log("formated date",_formatedDate);
        axios.post("registrafechacompromiso", { date:_formatedDate,SolicitudId:props.id }).then((response) => {
                setIsEditing(false);
                props.changePromiseDate(_formatedDate);
        });
    }
    return (
       
            <Grid container direction={"column"} >
                <Grid>
                    <Typography variant={"subtitle2"}> Fecha Compromiso</Typography>
                </Grid>
                <Grid container direction="row" justify={"space-between"} >
                    {isEditing && props.isManager ? <React.Fragment>
                        <Grid item>
                            <TextField name="promisedate" type="datetime-local"
                                onChange={(event) => updateDate(event.target.value)} />

                        </Grid>
                        <Grid item>
                            <Button color="primary" onClick={submitPromiseDate}
                                 disabled={date===""}
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