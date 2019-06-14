import React from 'react';
import {Link} from 'react-router-dom';
import {IconButton} from '@material-ui/core'
const MenuLink = props =>{
    return(
        <IconButton>
            <Link to={props.link} >
                <props.icon />
            </Link>
        </IconButton>
    )
}
export default MenuLink;
