import React from 'react';
import { CustomColumnsTable } from 'custom-columns-table/';
import { Tabs, Tab } from '@material-ui/core';
import { statusCodes } from '../constants/';
import {connect} from 'react-redux';
import { EmailOutline, EmailOpenOutline, AccountClockOutline, Check, FileCancelOutline } from 'mdi-material-ui'
import axios from 'axios';
const columnsArray = [{ label: "No. Solicitud", value: "id" },
{ label: "Estatus", value: "statusAvatar" },
{ label: "Problema", value: "problem" },
//{ label: "Descripcion", value: "description" },
 { label: "Quien lo Atiende", value: "engineer" },
{ label: "Fecha Alta", value: "date" }, 
{ label: "Categoria", value: "categoryName" },
];
const filterTickets = (ticketList, statusTab) => {
    let status = [];
    switch (statusTab) {
        case 1:
            status.push(statusCodes.NEW.value)
            break;
        case 2:
            status.push(statusCodes.IN_PROCESS.value)
            break;
        case 3:
            status.push(statusCodes.THIRD.value)
            break;
        case 4:
            status.push(statusCodes.SOLVED.value)
            status.push(statusCodes.BY_USER.value)
            break;
        case 5:
            status.push(statusCodes.REJECTED.value)           
            break;
        default:
            return ticketList;
    }
    return ticketList.filter(ticket=>{
        
        return status.indexOf(ticket.status)>=0;
    });
    

}
class IssuesList extends React.Component {
    state = {
        status: 0,
        ticketList: [],
        columns:null,
        
    }
    componentDidMount() {
        this.setState({ ticketList: this.props.ticketList });
        const data = {
            UsuarioLogin:this.props.user.username,
            operacion:"B",
            key:"columnas",
            value:"",
        }
        axios.post("trabajarpreferencias",data).then(response=>{
            const columns =  JSON.parse(response.data.value);
            this.setState({columns});
        }).catch(reason=>{
            console.log(reason);
        })
    }
    onChangeTab = (event, newStatus) => {
        const ticketList =  filterTickets(this.props.ticketList,newStatus);
        this.setState({
                ticketList,
                status: newStatus 
        });

    
    } 
    savePreferenceToServer=(columns)=>{
        const data = {
            UsuarioLogin:this.props.user.username,
            operacion:"U",
            key:"columnas",
            value:JSON.stringify(columns),
        };
        this.setState({columns});


        axios.post("trabajarpreferencias",data).then(response=>{
            console.log(response.data);
        }).catch(reason=>{
            console.log(reason);
        })
    }
    render() {
        const { onTicketClick } = this.props;
        const { ticketList, status } = this.state;
        return (
            <div>
                <Tabs value={status} onChange={this.onChangeTab}>
                    <Tab label={"Todos"} />
                    <Tab label={"Nuevos"} icon={<EmailOutline />} />
                    <Tab label={"En proceso"} icon={<EmailOpenOutline />} />
                    <Tab label={"Con tercero"} icon={<AccountClockOutline />} />
                    <Tab label={"Resueltos"} icon={<Check />} />
                    <Tab label={"Rechazados"} icon={<FileCancelOutline />} />
                </Tabs>
                <CustomColumnsTable columnsArray={columnsArray}
                    itemsList={ticketList} defaultColumns={["id", "statusAvatar", "problem", "engineer"]}
                    labelRowsPerPage={"Solicitudes por Pagina"}
                    savePreferenceToServer={this.savePreferenceToServer}
                    preferences={{columnsSelected:this.state.columns}}
                    numberColumnLabel={"#"} rowClickHandle={onTicketClick} />
            </div>
        )
    }
}
const mapStateToProps=state=>{
    return{
        user:state.user,
    }
}
export default connect(mapStateToProps)(IssuesList);