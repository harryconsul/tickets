import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, withTheme } from '@material-ui/core';
import { getOptionName } from './MenuBar'
const MenuLink =props=> {
    
        return (
            <Link to={props.link} title={getOptionName(props.link)}  >
                <IconButton style={{color:props.theme.palette.text.third}}>

                    <props.icon />

                </IconButton>
            </Link>
        )
    
}
export default withTheme(MenuLink);
