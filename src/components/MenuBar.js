import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import SearchField from './searchfield/SearchField';
import ChartBar from 'mdi-material-ui/ChartBar';
import FormatListNumbered from 'mdi-material-ui/FormatListNumbered';
import EmailPlusOutline from 'mdi-material-ui/EmailPlusOutline'
import MenuLink from './MenuLink';
import UserBar from './UserBar';
export const getOptionName = path => {
    switch (path) {
        case "/graficas":
            return "Dashboard";
        case "/nueva-solicitud":
            return "Nueva Solicitud";
        default:
            return "Administración";
    }
}
const MenuBar = props => {
    return (
        <div ref={props.barRef}>
            <AppBar style={{ backgroundColor: "#8e92d3" }} >
                <Toolbar>
                    <Grid container spacing={16} style={{ margin: 0 }}>
                        <Grid md={2} item>
                            <Typography variant={"h6"} style={{color:"white"}} >
                                {
                                    props.isManager ?
                                        getOptionName(props.currentOption) :
                                        "Nueva Solicitud"}
                            </Typography>
                        </Grid>
                        <Grid md={5} item>
                            {props.isManager ?
                                <SearchField history={props.history} /> :
                                null
                            }
                        </Grid>
                        <Grid md={5} item container spacing={8} justify={"flex-end"}>
                            {props.isManager ?
                                (
                                    <React.Fragment>
                                        <Grid item>
                                            <MenuLink 
                                            link="/nueva-solicitud" icon={EmailPlusOutline} />
                                        </Grid>
                                        
                                        <Grid item>
                                            <MenuLink link="/graficas" icon={ChartBar} />
                                        </Grid>
                                        <Grid item>
                                            <MenuLink link="/" icon={FormatListNumbered} />
                                        </Grid>
                                    </React.Fragment>
                                )
                                :
                                null
                            }


                            <Grid item style={{ textAlign: "right" }}>
                                <UserBar />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}
export default MenuBar;

