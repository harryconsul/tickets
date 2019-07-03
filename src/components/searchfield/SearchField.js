import React from 'react';
import { InputBase, IconButton } from '@material-ui/core';
import SearchIcon from 'mdi-material-ui/Magnify';
import CloseIcon from 'mdi-material-ui/Close';
import StatusAvatar from '../StatusAvatar'
import './SearchField.css';
import axios from 'axios';
import {connect} from 'react-redux';
import {actionSearch} from '../../actions/user.actions';
import BusquedaAvanzada from '../../components/BusquedaAvanzada';

class SearchField extends React.Component {
    state = {
        containerClass: "searchfield",
        search:"",
        clean: false
    }
    handleSearch = () => {
        this.postSearch();
    }
    onSearchKeyUp = (event) => {
        if (event.keyCode === 13) {
            this.postSearch();
       
        }
    }
    handleChange=event=>{
        this.setState({search:event.target.value});
    }
    postSearch = (searchValue = "") => {
        const _searchValue = searchValue === "" ? this.state.search : searchValue
        if (this.props.user) {
            const data = { UsuarioLogin: this.props.user.username, Busqueda: _searchValue };
            axios.post("obtienesolicitudes", data).then(response => {

                const ticketList =response.data.Solicitudes.map(ticket => {
                        return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }

                    })
                   
               this.props.dispatch(actionSearch(ticketList));
                this.props.history.push("/");
            }).catch(reason => {
                console.log(reason);
            })
        }
    }

    //Dejar en default los filtros de búsqueda.
    setClean = (clean) => {
        this.setState({
            clean: clean
        });
    }

    render() {
        
        return (
            <div className={this.state.containerClass}>
                <IconButton style={{ padding: "4px" }} onClick={() => this.postSearch()}>
                    <SearchIcon />
                </IconButton>

                <InputBase placeholder="Busca solicitudes"
                    style={{ flex: "1" }}
                    value={this.state.search}
                    autoFocus={true} onKeyUp={this.onSearchKeyUp}
                    onFocus={() => this.setState({ containerClass: "searchfieldEditing" })}
                    onBlur={() => this.setState({ containerClass: "searchfield" })}
                    onChange={this.handleChange}
                />
                {/*<IconButton style={{ padding: "4px" }} onClick={() => this.postClean()}>
                    <CloseIcon />
                </IconButton>
                */}
                <BusquedaAvanzada history = {this.props.history}
                setClean={this.setClean.bind(this)} clean = {this.state.clean} />
            </div>
        );
    }
}
const mapStateToProps = state => {
    
    return {
        user: state.user,
       
    }
}
export default connect(mapStateToProps)(SearchField);