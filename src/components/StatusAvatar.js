import React from 'react';
import { Avatar } from '@material-ui/core'
import { statusCodes } from '../constants';
const getStatusColor = status => {
    let color = null;
    switch (status) {
        case statusCodes.IN_PROCESS.value:
            color = statusCodes.IN_PROCESS.color;
            break;
        case statusCodes.SOLVED.value:
            color = statusCodes.SOLVED.color;
            break;
        case statusCodes.REJECTED.value:
            color = statusCodes.REJECTED.color;
            break;
        case statusCodes.THIRD.value:
            color = statusCodes.THIRD.color;
            break;
        case statusCodes.BY_USER.value:
            color = statusCodes.BY_USER.color;
            break;
        default:
            color = statusCodes.NEW.color;


    }
    return color;
}
const getDescription = status => {
    switch (status) {
        case statusCodes.IN_PROCESS.value:
            return "EN PROCESO";
            break;
        case statusCodes.SOLVED.value:
            return "RESUELTO";
            break;
        case statusCodes.REJECTED.value:
            return "CANCELADA";
        case statusCodes.THIRD.value:
            return "TERCEROS";
            break;
        case statusCodes.BY_USER.value:
            return "USUARIO";
            break;
        default:
            return "NUEVO";
            break;
    }
}

const StatusAvatar = props => {

    return (
        <Avatar style={{ backgroundColor: getStatusColor(props.status)}}>
            {props.status}
        </Avatar>
    );
}
export default StatusAvatar;
