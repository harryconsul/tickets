import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import SearchField from './searchfield/SearchField';
import ChartBar from 'mdi-material-ui/ChartBar';
import FormatListNumbered from 'mdi-material-ui/FormatListNumbered';
import EmailPlusOutline from 'mdi-material-ui/EmailPlusOutline'
import GridIcon from 'mdi-material-ui/Grid'
import MenuLink from './MenuLink';
import UserBar from './UserBar';
export const getOptionName = (path, isManager = true) => {
    switch (path) {
        case "/graficas":
            return "Dashboard";
        case "/reportes":
            return "Reportes";
        case "/mis-solicitudes":
            return "Mis Solicitudes";
        case "/nueva-solicitud":
            return "Nueva Solicitud";
        default:
            return isManager ? "Administración" : "Nueva Solicitud";
    }
}
const MenuBar = props => {
    return (
        <div ref={props.barRef}>
            <AppBar style={{ backgroundColor: "#8e92d3" }} >
                <Toolbar>
                    <Grid container spacing={16} style={{ margin: 0 }}>
                        <Grid md={2} item>
                            <Typography variant={"h6"} style={{ color: "white" }} >
                                {
                                    props.isManager ?
                                        getOptionName(props.currentOption) :
                                        "Nueva Solicitud"}
                            </Typography>
                        </Grid>
                        <Grid md={5} item>
                            <SearchField history={props.history} isManager={props.isManager} />
                        </Grid>
                        <Grid md={5} item container spacing={8} justify={"flex-end"}>
                            {props.isManager ?
                                (
                                    <React.Fragment>
                                        <Grid item>
                                            <MenuLink link="/nueva-solicitud" icon={EmailPlusOutline} />
                                        </Grid>
                                        <Grid item>
                                            <MenuLink link="/graficas" icon={ChartBar} />
                                        </Grid>
                                        <Grid item>
                                            <MenuLink link="/reportes" icon={GridIcon} />
                                        </Grid>
                                        <Grid item>
                                            <MenuLink link="/mis-solicitudes" icon={FormatListNumbered} />
                                        </Grid>
                                        {props.profile === 'S' ?
                                            <Grid item>
                                                <MenuLink link="/organizacion" icon={FormatListNumbered} />
                                            </Grid> : null
                                        }
                                    </React.Fragment>
                                )
                                :
                                (
                                    <React.Fragment>
                                        <Grid item>
                                            <MenuLink
                                                link="/" icon={EmailPlusOutline} />
                                        </Grid>
                                        <Grid item>
                                            <MenuLink link="/mis-solicitudes" icon={FormatListNumbered} />
                                        </Grid>
                                    </React.Fragment>
                                )
                            }


                            <Grid item style={{ textAlign: "right" }}>
                                <UserBar />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div >
    )
}
export default MenuBar;

