import React from 'react';
import { Grid,MenuItem,Tabs,Tab } from '@material-ui/core';
import PivotTable from './PivotTable';
import ControlledInput from './ControlledInput';
import { pivotTableDataSource } from '../constants/'

const PivotLayout = (props) => {
    const [rango,setRango] = React.useState(7);
    const [tab,setTab] = React.useState(3);
    
    return (
        <Grid container spacing={16} justify={"center"} >
            <Grid item md={12}>
                <ControlledInput id={"fltRango"}
                    value={rango}
                    onChange={(event)=>setRango(event.target.value)}
                    name={"rango"}
                    label={"Rango de fechas"}
                    select
                    >
                    {props.timeRanges.map(rango =>{
                    return (
                        <MenuItem key={rango.Id} value={rango.Id}>
                            {rango.Descripcion}
                        </MenuItem>
                    );
                })}
                </ControlledInput>
            </Grid>
            
            <Grid item md={12}>
                <Tabs value ={tab} onChange={(event,tab)=>{
                    console.log(tab);
                    setTab(tab)
                }
                    }>
                    <Tab label={"Todas mis solicitudes"} />
                    <Tab label={"Top 10 Usuarios"} />
                    
                </Tabs>
                {   tab===0?
                    <PivotTable {...pivotTableDataSource.ticketsAmount}  data={{Rango:rango,Usuario:props.usuario}}/>
                    : <PivotTable {...pivotTableDataSource.topUsers} data={{Rango:rango,Usuario:props.usuario}} />
                }
            </Grid>
        </Grid>
    )

}
export default PivotLayout;