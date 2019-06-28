import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core'
import {getOptionName} from './MenuBar'
const MenuLink = props => {
    return (
        <Link to={props.link} title={getOptionName(props.link)} >
            <IconButton>

                <props.icon />

            </IconButton>
        </Link>
    )
}
export default MenuLink;
