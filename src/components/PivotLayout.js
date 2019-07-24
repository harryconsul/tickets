import React from 'react';
import { Grid, MenuItem, Tabs, Tab } from '@material-ui/core';
import PivotTable from './PivotTable';
import ControlledInput from './ControlledInput';
import { pivotTableDataSource } from '../constants/'

const PivotLayout = (props) => {
    //rango 4 es igual a 2 Semanas
    const [rango, setRango] = React.useState(4);
    
    const [tab, setTab] = React.useState(0);
    const style = { width: "20%",margin:"5px 0px 5px 0px" };

    return (
        <Grid container spacing={16} justify={"center"} >
            <Grid item xs={12} >
                <ControlledInput id={"fltRango"}
                    value={rango}
                    onChange={(event) => setRango(event.target.value)}
                    name={"rango"}
                    label={"Rango de fechas"}
                    select
                    style={style}>
                >
                    {props.timeRanges.map(rango => {
                        return (
                            <MenuItem key={rango.Id} value={rango.Id}>
                                {rango.Descripcion}
                            </MenuItem>
                        );
                    })
                }
                </ControlledInput>
            </Grid>

            <Grid item xs={12}>
                <Tabs value={tab} onChange={(event, tab) => {
                    console.log("Tab ",tab);
                    setTab(tab)
                }
                }>
                    <Tab label={"Todas mis solicitudes"} />
                    <Tab label={"Top 10 Usuarios"} />

                </Tabs>
                {tab === 0 ?
                    <PivotTable {...pivotTableDataSource.ticketsAmount} data={{ Rango: rango, Usuario: props.usuario }} />
                    : <PivotTable {...pivotTableDataSource.topUsers} data={{ Rango: rango, Usuario: props.usuario }} />
                }
            </Grid>
        </Grid>
    )

}
export default PivotLayout;