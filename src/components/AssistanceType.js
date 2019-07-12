import React from 'react';
import { Button, Grid,  Typography,Select } from '@material-ui/core';
import HandIcon from 'mdi-material-ui/Hand';
import axios from 'axios';
const AssistanceType = (props) => {
    const [assistance, setAssistance] = React.useState(props.assistance);

    const submitAssistance = () => {
        axios.post("registratipoasistencia", { assistance, SolicitudId: props.id })
            .then((response) => {
                props.changeAssistance(assistance)
            }).catch(reason=>console.log("reason",reason));
    }
    return (
        <Grid container direction={"column"} >
            <Grid>
                <Typography variant={"subtitle2"}>Tipo de Atención</Typography>
            </Grid>
            <Grid container direction="row" justify={"space-between"} >

                <Grid item>
                    <Select name="promisedate" type="date" native
                        value={assistance}
                        onChange={(event) => setAssistance(Number(event.target.value))} >
                        {
                            props.assistanceOptions.map((item)=>{
                                return (<option key={item.id} value={item.id}>
                                        {item.label}
                                </option>);
                            })
                        }
                    </Select>

                </Grid>
                <Grid item>
                    <Button color="primary" onClick={submitAssistance}                        
                        variant={"outlined"} >
                        <HandIcon />
                    </Button>
                </Grid>

            </Grid>
        </Grid>

    )

}
export default AssistanceType;
