import React from 'react';
import PropTypes from 'prop-types';
import { CustomColumnsTable } from 'custom-columns-table/';
import { Tabs, Tab, Grid } from '@material-ui/core';
import { statusCodes } from '../constants/';
import { actionUpdatePreferences, actionChangePage } from '../actions/user.actions';
import { connect } from 'react-redux';
import { EmailOutline, EmailOpenOutline, AccountClockOutline, Check, FileCancelOutline } from 'mdi-material-ui'
import axios from 'axios';
import SwitchCheck from '../components/SwitchControl/SwitchCheck';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const columnsArray = [{ label: "No. Solicitud", value: "id" },
{ label: "Estatus", value: "statusAvatar" },
{ label: "Problema", value: "problem" },
{ label: "¿Quien solicita?", value: "user" },
{ label: "¿Quién lo atiende?", value: "engineer" },
{ label: "Fecha Alta", value: "date" },
{ label: "Categoría", value: "categoryName" },
{ label: "Fecha Cierre", value: "finishDate" },
{ label: "Tipo de Atencion", value: "assistance" },
];
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

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
});

class IssuesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            ticketList: props.ticketList,
            columns: null,
            myTickets: false,
        }

    }

    handleSwitch = (bandera) => {
        this.setState({ myTickets: bandera });
    }

    onChangeTab = (event, newStatus) => {
        const ticketList = filterTicketsByStatus(this.props.ticketList, newStatus);
        this.setState({
            ticketList,
            status: newStatus
        });


    }
    onChangePage = () => {

    }
    savePreferenceToServer = (columns) => {
        const data = {
            UsuarioLogin: this.props.user.username,
            operacion: "U",
            key: "columnas",
            value: JSON.stringify(columns),
        };
        this.props.dispatch(actionUpdatePreferences("columnas", columns));


        axios.post("trabajarpreferencias", data).then(response => {
            console.log(response.data);
        }).catch(reason => {
            console.log(reason);
        })
    }

    getTotalByStatus = (status, myTickets) => {
        return filterTicketsByStatus(this.props.ticketList, status).filter(ticket => {
            return (ticket.engineer.indexOf(this.props.user.username) >= 0 || ticket.registro.indexOf(this.props.user.username) >= 0 || !myTickets);
        }).length;
    }

    render() {
        const { classes } = this.props;
        const { onTicketClick } = this.props;
        const { ticketList, status, myTickets } = this.state;

        const filteredList = ticketList.filter(ticket => {
            return (ticket.engineer.indexOf(this.props.user.username) >= 0 || ticket.registro.indexOf(this.props.user.username) >= 0 || !myTickets);
        });

        const total = this.getTotalByStatus(0, myTickets);
        const nuevo = this.getTotalByStatus(1, myTickets);
        const proceso = this.getTotalByStatus(2, myTickets);
        const resueltos = this.getTotalByStatus(3, myTickets);
        const rechazados = this.getTotalByStatus(4, myTickets);

        return (
            <div style={{ width: '100%' }}>
                {
                    this.props.user.isManager ?
                        <div>
                            <Grid container spacing={5}>
                                <Grid item xs={10}>
                                    <Tabs value={status} onChange={this.onChangeTab}>
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
                                                    EN PROCESO
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
                                                    RECHAZADOS
                                            </Badge>
                                            } icon={<FileCancelOutline />} />
                                    </Tabs>
                                </Grid>
                                <Grid item xs={2} alignItems="center">
                                    <SwitchCheck labelName="Mis Solicitudes" handleSwitch={this.handleSwitch} />
                                </Grid>
                            </Grid>
                        </div>
                        :
                        null
                }
                <CustomColumnsTable columnsArray={columnsArray}
                    itemsList={filteredList} defaultColumns={["id", "statusAvatar", "problem", "engineer"]}
                    labelRowsPerPage={"Solicitudes por página"}
                    changePageCallback={(page) => this.props.dispatch(actionChangePage(page))}
                    savePreferenceToServer={this.savePreferenceToServer}
                    preferences={{ columnsSelected: this.props.columnas }}
                    initialPage={this.props.page}
                    numberColumnLabel={"#"} rowClickHandle={onTicketClick} />
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.user,
        columnas: state.preferences.columnas,
        page: state.page,
    }
}

IssuesList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(IssuesList));