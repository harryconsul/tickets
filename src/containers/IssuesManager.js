import React from 'react';
import IssuesList from './IssuesList';
import axios from 'axios';
import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import TicketEditor from './TicketEditor';
import StatusAvatar from '../components/StatusAvatar'

class IssuesManager extends React.Component {
    state = {
        ticketList: [], search: "", selectedTicket: null
    }
    componentDidMount() {
        this.postSearch();


    }
    
    postSearch = (searchValue = "") => {
        const _searchValue = searchValue === "" ? this.state.search : searchValue
        if (this.props.user) {
            const data = { UsuarioLogin: this.props.user.username, Busqueda: _searchValue };
            axios.post("obtienesolicitudes", data).then(response => {
                this.setState({
                    ticketList: response.data.Solicitudes.map(ticket => {
                        return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }
                    })
                });
            }).catch(reason => {
                console.log(reason);
            })
        }
    }
    onTicketClick = (id) => {
        const ticket = this.state.ticketList.find(item => item.id === id);
        this.setState({ selectedTicket: ticket },()=>{
            this.props.history.push("/admin/solicitud/"+ id);
        });
        

    }
    render() {
        let { ticketList, selectedTicket } = this.state;
        ticketList = this.props.result!==null?this.props.result:ticketList;
        return (

                <React.Fragment>
                    <Route exact path={"/admin/"}  component={()=>
                          <IssuesList ticketList={ticketList} onTicketClick={this.onTicketClick} />
                    }/>
                    <Route path={"/admin/solicitud/:id"} component={()=>
                        <TicketEditor {...selectedTicket} />
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