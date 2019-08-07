import React from 'react';
import IssuesList from './IssuesList';

import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import TicketEditor from './TicketEditor';
import StatusAvatar from '../components/StatusAvatar'
import { actionSearch, actionCompleteSearch } from '../actions/user.actions';


class IssuesManager extends React.Component {
    state = {
        selectedTicket: null,
    }
    componentDidMount() {
        // if (!this.props.result.length) {

        this.postSearch();
        //}


    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname.indexOf("/solicitud/") < 0) {

            return true;
        }
        return false;
    }
    postSearch = (searchValue = "") => {
        if (this.props.isSearching) {
            this.props.dispatch(actionCompleteSearch())
        } else {
            const _searchValue = searchValue === "" ? this.state.search : searchValue
            if (this.props.user) {
                const data = {
                    UsuarioLogin: this.props.user.username,
                    Perfil: this.props.user.profile,
                    Busqueda: null
                };

                this.props.dispatch(actionSearch(data)).then(()=>{
                    this.props.dispatch(actionCompleteSearch())
                });
            }
        }
    }
    handleTicketUpdate = ({ id, engineer, status }) => {
        const updatedTicketList = [...this.props.result];

        const indexOf = updatedTicketList.findIndex(item => item.id === id);

        if (indexOf >= 0) {
            const _engineer = engineer ?
                engineer :
                updatedTicketList[indexOf].engineer;

            updatedTicketList[indexOf] = {
                ...updatedTicketList[indexOf],
                engineer: _engineer,
                status
                , statusAvatar: <StatusAvatar status={status} />,
            };
            this.props.dispatch(actionSearch(updatedTicketList));
        }
    }
    onTicketClick = (id) => {

        const basePath = "/mis-solicitudes/";
        const original_ticket = this.props.result.find(item => item.id === id);
        const ticket = {
            ...original_ticket,
            statusAvatar: null,
            fields: [],
        }

        this.setState({ selectedTicket: ticket }, () => {
            this.props.history.push(basePath + "solicitud/" + id);
        });




    }
    render() {
        let { ticketList, selectedTicket } = this.state;

        const basePath = "/mis-solicitudes/";
        ticketList = this.props.result;
        return (

            <React.Fragment>
                <Route exact path={basePath} component={() =>
                    <IssuesList ticketList={ticketList} onTicketClick={this.onTicketClick} />
                } />
                <Route exact path={basePath + "solicitud/:id"} component={() =>
                    <TicketEditor {...selectedTicket}
                    />
                } />

            </React.Fragment>

        );
    }

}
const mapStateToProps = state => {

    return {
        user: state.user,
        result: state.result,
        isSearching: state.search.isSearching,
    }
}
export default connect(mapStateToProps)(IssuesManager)