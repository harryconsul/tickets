import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from '../context/SocketContext';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { statusCodes } from '../constants/';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { EmailOutline, EmailOpenOutline, Check, FileCancelOutline } from 'mdi-material-ui';
import SwitchCheck from '../components/SwitchControl/SwitchCheck';
import { actionChangePage, actionKeepAdminSwitch, actionKeepUserSwitch } from '../actions/user.actions';
import CustomMaterialTable from '../components/MaterialTable/CustomMaterialTable';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: `0 ${theme.spacing(2)}px`,

    },
});

const usuario = [
    { label: "Solicitud", value: "id" },
    { label: "Estatus", value: "statusAvatar" },
    { label: "Problema", value: "problem" },
    { label: "¿Quién lo atiende?", value: "engineer" },
    { label: "Fecha Alta", value: "date" },
    { label: "Fecha Compromiso", value: "promiseDate" },
    { label: "Fecha Cierre", value: "finishDate" },
];
const administrador = [
    { label: "Solicitud", value: "id" },
    { label: "Estatus", value: "statusAvatar" },
    { label: "Problema", value: "problem" },
    { label: "¿Quién solicita?", value: "user" },
    { label: "¿Quién lo atiende?", value: "engineer" },
    { label: "Categoría", value: "categoryName" },
    { label: "Fecha Alta", value: "date" },
    { label: "Fecha Compromiso", value: "promiseDate" },
    { label: "Fecha Cierre", value: "finishDate" },
];

const getTotalByStatus = (status, myTickets, props) => {
    return filterTicketsByStatus(props.ticketList, status).filter(ticket => {
        return (ticket.engineer.indexOf(props.user.username) >= 0 || ticket.registro.indexOf(props.user.username) >= 0 || !myTickets);
    }).length;
}

const filterTicketsByStatus = (ticketList, statusTab) => {
    let status = [];
    switch (statusTab) {
        case 1:
            status.push(statusCodes.NEW.value)
            break;
        case 2:
            status.push(statusCodes.IN_PROCESS.value)
            break;
        /*case 3:
            status.push(statusCodes.THIRD.value)
            break;*/
        case 3:
            status.push(statusCodes.SOLVED.value)
            status.push(statusCodes.BY_USER.value)
            break;
        case 4:
            status.push(statusCodes.REJECTED.value)
            break;
        default:
            return ticketList;
    }
    return ticketList.filter(ticket => {
        return status.indexOf(ticket.status) >= 0;
    });


}

const TicketList = (props) => {

    const [state, setState] = useState({
        status: 0,
        ticketList: props.ticketList,
        columns: null,
        myTickets: props.myTickets ? props.myTickets : false,
        inProcess: props.inProcess ? props.inProcess : false,
    })

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.on('current-tickets', (data) => {
            //Por ahora solo realiza la búsqueda default.
            console.log('realizar busqueda de tickets',data);
            props.postSearch();
        })

        return () => socket.off('current-tickets');
    }, [socket]);


    const onChangeTab = (event, newStatus) => {
        const ticketList = filterTicketsByStatus(props.ticketList, newStatus);

        setState({
            ...state,
            ticketList,
            status: newStatus
        });

    }

    const handleSwitchAdmin = (bandera, page = 0) => {
        const myTickets = bandera;
        setState({
            ...state,
            myTickets,
        });

        props.dispatch(actionChangePage(page));
        props.dispatch(actionKeepAdminSwitch(bandera));
    }

    const handleSwitchUser = (bandera, page = 0) => {
        const inProcess = bandera;
        setState(
            ...state,
            inProcess,
        );

        props.dispatch(actionChangePage(page));
        props.dispatch(actionKeepUserSwitch(bandera));
    }

    const { user, page, classes, onTicketClick } = props;
    const { ticketList, status, myTickets, inProcess } = state;

    let filteredList = ticketList.filter(ticket => {
        return (ticket.engineer.indexOf(user.username) >= 0
            || ticket.registro.indexOf(user.username) >= 0
            || !myTickets);
    });

    const total = getTotalByStatus(0, myTickets, props);
    const nuevo = getTotalByStatus(1, myTickets, props);
    const proceso = getTotalByStatus(2, myTickets, props);
    const resueltos = getTotalByStatus(3, myTickets, props);
    const rechazados = getTotalByStatus(4, myTickets, props);

    const { profile } = user;
    const columnas = profile === 'U' ? [...usuario] : [...administrador];

    //El perfil usuario podrá filtrar nuevo y en proceso
    if (!inProcess && profile === 'U')
        filteredList = filteredList.filter(({ status }) => status.trim() === "NU" || status.trim() === "PR");

    return (
        <>
            {
                user.isManager ?
                    <div>
                        <Grid container spacing={5}>
                            <Grid item xs={10}>
                                <Tabs value={status} onChange={onChangeTab}>
                                    <Tab label={
                                        <Badge className={classes.padding} color="primary" badgeContent={total}>
                                            TODOS
                                            </Badge>
                                    }
                                    />
                                    <Tab label={
                                        <Badge className={classes.padding} color="primary" badgeContent={nuevo}>
                                            NUEVOS
                                                </Badge>
                                    }
                                        icon={<EmailOutline />} />
                                    <Tab label={
                                        <Badge className={classes.padding} color="primary" badgeContent={proceso}>
                                            REVISIÓN
                                            </Badge>
                                    }
                                        icon={<EmailOpenOutline />} />
                                    {/*<Tab label={"Con tercero"} icon={<AccountClockOutline />} />*/}
                                    <Tab label={
                                        <Badge className={classes.padding} color="primary" badgeContent={resueltos}>
                                            RESUELTOS
                                            </Badge>
                                    } icon={<Check />} />
                                    <Tab label={
                                        <Badge className={classes.padding} color="primary" badgeContent={rechazados}>
                                            CANCELADAS
                                            </Badge>
                                    } icon={<FileCancelOutline />} />
                                </Tabs>
                            </Grid>
                            <Grid item xs={2} >
                                <SwitchCheck status={myTickets} labelName="Mis solicitudes" handleSwitch={handleSwitchAdmin} />
                            </Grid>
                        </Grid>
                    </div>
                    :
                    <div>
                        <Grid container direction="row" justify="flex-end">
                            <SwitchCheck status={inProcess} labelName="Todo" handleSwitch={handleSwitchUser} />
                        </Grid>
                    </div>
            }

            <CustomMaterialTable
                columnas={columnas}
                list={filteredList}
                changePageCallback={(page) => props.dispatch(actionChangePage(page))}
                labelRowsPerPage={"Solicitudes por página"}
                rowClickHandle={onTicketClick}
                initialPage={page}
            />
        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        columnas: state.preferences.columnas,
        page: state.page,
        myTickets: state.myTickets,
        inProcess: state.inProcess,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(TicketList));