import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core'
const MenuLink = props => {
    return (
        <Link to={props.link} >
            <IconButton>

                <props.icon />

            </IconButton>
        </Link>
    )
}
export default MenuLink;
