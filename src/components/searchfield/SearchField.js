import React from 'react';
import { InputBase, IconButton } from '@material-ui/core';
import SearchIcon from 'mdi-material-ui/Magnify';
import StatusAvatar from '../StatusAvatar'
import './SearchField.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { actionSearch } from '../../actions/user.actions';
import BusquedaAvanzada from '../../components/BusquedaAvanzada';

class SearchField extends React.Component {
    state = {
        containerClass: "searchfield",
        search: "",
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
    handleChange = event => {
        this.setState({ search: event.target.value });
    }
    postSearch = (searchValue = "") => {
        const _searchValue = searchValue === "" ? this.state.search : searchValue
        if (this.props.user) {
            const data = {
                UsuarioLogin: this.props.user.username,
                Perfil: this.props.user.profile,
                Busqueda: _searchValue
            };

           this.props.dispatch(actionSearch(data))
                .then(()=>this.props.history.push("/mis-solicitudes"));

        }
    }

    //Dejar en default los filtros de búsqueda.
    setClean = (clean) => {
        this.setState({
            clean: clean
        });
    }

    cleanSearch = () => {
        this.setState({
            search: ""
        });
    }

    setInputClean = (data, departamento, rango, categoria) => {
        let search = ""
        if (data.Problema.length !== 0)
            search += " problema: " + data.Problema
        if (data.Id.length !== 0 && data.Id !== 0)
            search += " solicitud: " + data.Id
        if (data.Atiende.length !== 0)
            search += " atiende: " + data.Atiende
        if (data.Solicitante.length !== 0)
            search += " solicitó: " + data.Solicitante
        if (data.departamento !== 0 && departamento.length !== 0)
            search += " departamento: " + departamento
        if (data.categoria !== 0 && categoria.length !== 0)
            search += " categoría: " + categoria
        if (data.rango !== 0 && rango.length !== 0)
            search += " rango: " + rango
        if (data.Resuelto)
            search += " resuelto por el usuario"

        this.setState({
            search: search
        });
    }
    render() {

        return (
            <div className={this.state.containerClass}>
                <IconButton style={{ padding: "4px" }} onClick={() => this.postSearch()}>
                    <SearchIcon />
                </IconButton>

                <InputBase placeholder="Buscar solicitudes"
                    style={{ flex: "1" }}
                    value={this.state.search}
                    autoFocus={true} onKeyUp={this.onSearchKeyUp}
                    onFocus={() => this.setState({ containerClass: "searchfieldEditing" })}
                    onBlur={() => this.setState({ containerClass: "searchfield" })}
                    onChange={this.handleChange}
                />
                {this.props.isManager ?
                    <BusquedaAvanzada
                        history={this.props.history} setClean={this.setClean.bind(this)}
                        clean={this.state.clean} cleanSearch={this.cleanSearch.bind(this)}
                        setInputClean={this.setInputClean.bind(this)}
                    />
                    :
                    null
                }
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