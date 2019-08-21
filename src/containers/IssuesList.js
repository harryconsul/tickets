import React from 'react';
import { CustomColumnsTable } from 'custom-columns-table/';
import { Tabs, Tab } from '@material-ui/core';
import { statusCodes } from '../constants/';
import {actionUpdatePreferences,actionChangePage} from '../actions/user.actions';
import {connect} from 'react-redux';
import { EmailOutline, EmailOpenOutline, AccountClockOutline, Check, FileCancelOutline } from 'mdi-material-ui'
import axios from 'axios';
const columnsArray = [{ label: "No. Solicitud", value: "id" },
{ label: "Estatus", value: "statusAvatar" },
{ label: "Problema", value: "problem" },
{label:"¿Quien solicita?",value:"user"},
 { label: "¿Quién lo atiende?", value: "engineer" },
{ label: "Fecha Alta", value: "date" }, 
{ label: "Categoría", value: "categoryName" },
{label:"Fecha Cierre",value:"finishDate"},
{label:"Tipo de Atencion",value:"assistance"},
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
    constructor(props){
        super(props);
        this.state = {
            status: 0,
            ticketList: props.ticketList,
            columns:null,
            
        }
        
    }
    
   
    onChangeTab = (event, newStatus) => {
        const ticketList =  filterTickets(this.props.ticketList,newStatus);
        this.setState({
                ticketList,
                status: newStatus 
        });

    
    } 
    onChangePage=()=>{

    }
    savePreferenceToServer=(columns)=>{
        const data = {
            UsuarioLogin:this.props.user.username,
            operacion:"U",
            key:"columnas",
            value:JSON.stringify(columns),
        };
        this.props.dispatch(actionUpdatePreferences("columnas",columns));


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
            <div style={{width:'100%'}}>
                {
                    this.props.user.isManager?
                    <Tabs value={status} onChange={this.onChangeTab}>
                        <Tab label={"Todos"} />
                        <Tab label={"Nuevos"} icon={<EmailOutline />} />
                        <Tab label={"En proceso"} icon={<EmailOpenOutline />} />
                        <Tab label={"Con tercero"} icon={<AccountClockOutline />} />
                        <Tab label={"Resueltos"} icon={<Check />} />
                        <Tab label={"Rechazados"} icon={<FileCancelOutline />} />
                    </Tabs>
                    :
                    null
                }
                
                <CustomColumnsTable columnsArray={columnsArray}
                    itemsList={ticketList} defaultColumns={["id", "statusAvatar", "problem", "engineer"]}
                    labelRowsPerPage={"Solicitudes por Pagina"}
                    changePageCallback={(page)=>this.props.dispatch(actionChangePage(page))}
                    savePreferenceToServer={this.savePreferenceToServer}
                    preferences={{columnsSelected:this.props.columnas}}
                    initialPage={this.props.page}  
                    numberColumnLabel={"#"} rowClickHandle={onTicketClick} />
            </div>
        )
    }
}
const mapStateToProps=state=>{
    return{
        user:state.user,
        columnas:state.preferences.columnas,
        page:state.page,
    }
}
export default connect(mapStateToProps)(IssuesList);