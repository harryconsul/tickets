import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import SearchField from './searchfield/SearchField';
import ChartBar from 'mdi-material-ui/ChartBar';
import FormatListNumbered from 'mdi-material-ui/FormatListNumbered';
import MenuLink from './MenuLink';
const getOptionName = path=>{
    switch(path){
        case "/admin/graficas":
            return "Dashboard";
        default:
            return "Administración";
    }
}
const MenuBar = props => {
    return (
        <AppBar>
            <Toolbar>
                <Grid container spacing={16} style={{margin:0}}>
                    <Grid md={6} item>
                    <Typography variant={"h6"} >
                    {getOptionName(props.currentOption)}
                    </Typography>
                    </Grid>
                    <Grid md={4} item>
                        <SearchField history={props.history} />
                    </Grid>
                    <Grid md={1} item>
                        <MenuLink link="/admin/" icon={FormatListNumbered} />
                    </Grid>
                    <Grid md={1} item>
                        <MenuLink link="/admin/graficas" icon={ChartBar} />
                    </Grid>

                    
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
export default MenuBar;

