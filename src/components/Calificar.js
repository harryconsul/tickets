import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import Rating from "@material-ui/lab/Rating";
import axios from 'axios';

const Calificar = (props) => {
    const [value, setValue] = useState(props.calificacion);
    const status = ['RE','RU'] //Resuelto y Resuelto por el Usuario
    const properties = status.includes(props.status) && props.owner == props.user ? {readOnly:false}:{readOnly:true};

    useEffect(() => {
        axios.post("registrarcalificacion", { SolicitudId: props.id, Usuario: props.user, Calificacion: value })
            .then((response) => {
                props.changeCalificacion(value);
            }).catch(reason => console.log("reason", reason));
    }, [value]);

    return (
        <Grid container direction={"column"} >
            <Grid>
                <Typography variant={"subtitle2"}>Calificar servicio</Typography>
            </Grid>
            <Rating
                {...properties}
                name="hover-feedback"
                max={5}
                style={{color:'#ff6d75'}}
                value={value}
                
                onChange={(event, newValue) => {
                    if(newValue != null){
                        setValue(newValue);
                    }else{
                        setValue(0);
                    }
                }}
            />
        </Grid>
    )
}

export default Calificar;