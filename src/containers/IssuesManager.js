import React from 'react';
import IssuesList from './IssuesList';
import axios from 'axios';
import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import TicketEditor from './TicketEditor';
import StatusAvatar from '../components/StatusAvatar'
import {actionSearch} from '../actions/user.actions';

class IssuesManager extends React.Component {
    state = {
        selectedTicket: null,
    }
    componentDidMount() {
        if(!this.props.result.length){
            this.postSearch();
        }


    }
    
    postSearch = (searchValue = "") => {
        const _searchValue = searchValue === "" ? this.state.search : searchValue
        if (this.props.user) {
            const data = { UsuarioLogin: this.props.user.username, Busqueda: _searchValue };
            axios.post("obtienesolicitudes", data).then(response => {
                const ticketList =  response.data.Solicitudes.map(ticket => {
                    return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }
                });
                this.props.dispatch(actionSearch(ticketList));
              
            }).catch(reason => {
                console.log(reason);
            })
        }
    }
    handleTicketUpdate=({id,engineer,status})=>{
        const updatedTicketList = [...this.props.result];
        
        const indexOf = updatedTicketList.findIndex(item=>item.id===id);

        if(indexOf>=0){
            const _engineer = engineer?
                engineer:
                updatedTicketList[indexOf].engineer;

            updatedTicketList[indexOf] ={
                ...updatedTicketList[indexOf],
                engineer:_engineer,
                status
            ,statusAvatar:<StatusAvatar status={status} />,
            };
            this.props.dispatch(actionSearch(updatedTicketList));
        }
    }
    onTicketClick = (id) => {
        const ticket = this.props.result.find(item => item.id === id);
        this.setState({ selectedTicket: ticket },()=>{
            this.props.history.push("/solicitud/"+ id);
        });
        

    }
    render() {
        let { ticketList, selectedTicket } = this.state;
        ticketList = this.props.result;
        return (

                <React.Fragment>
                    <Route exact path={"/"}  component={()=>
                          <IssuesList ticketList={ticketList} onTicketClick={this.onTicketClick} />
                    }/>
                    <Route path={"/solicitud/:id"} component={()=>
                        <TicketEditor {...selectedTicket} 
                        handleTicketUpdate={this.handleTicketUpdate}/>
                    } /> 
               
                </React.Fragment>

        );
    }

}
const mapStateToProps = state => {
    
    return {
        user: state.user,
        result:state.result,
    }
}
export default connect(mapStateToProps)(IssuesManager)