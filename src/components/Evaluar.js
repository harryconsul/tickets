import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import Rating from "@material-ui/lab/Rating";
import axios from 'axios';

const labels = {
    0: 'No aplica',
    1: 'Básico',
    2: 'Intermedio',
    3: 'Avanzado',
}

const useStyles = makeStyles({
    root:{
        width: 200,
        display: "flex",
        alignItems: "center",
    }
})

const Evaluar = (props) => {

    const [value, setValue] = useState(props.evaluacion);
    const status = ['RE', 'RU'] //Resuelto y Resuelto por el Usuario
    const properties = { readOnly: false };//status.includes(props.status) ? {readOnly:false}:{readOnly:true};
    const classes = useStyles();
    
    useEffect(() => {
        axios.post("registrarevaluacion", { SolicitudId: props.id, Usuario: props.user, Evaluacion: value })
            .then((response) => {
                props.changeEvaluacion(value);
                console.warn(value);
            }).catch(reason => console.log("reason", reason));
    }, [value]);

    return (
        <Grid container direction={"column"} >
            <Grid>
                <Typography variant={"subtitle2"}>Evaluar servicio</Typography>
            </Grid>
            <div className={classes.root}>
                <Rating
                    {...properties}
                    name="hover-feedback"
                    value={value}
                    max={3}
                    onChange={(event, newValue) => {
                        if(newValue != null){
                            setValue(newValue);
                        }else{
                            setValue(0);
                        }
                    }}
                />
                {
                    value !== null && (
                        <Box ml={2}>{labels[value !== -1 ? value : value]}</Box>
                    )
                }
            </div>
        </Grid>
    )
}

export default Evaluar;