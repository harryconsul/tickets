import React from 'react';
import * as actionConstants from './action.constants';
import StatusAvatar from '../components/StatusAvatar';
import axios from 'axios';
export const actionLogin = user => {
    return {
        type: actionConstants.LOGIN,
        user,
    }
}
export const doSearch = (search, result) => {
    return {
        type: actionConstants.SEARCH,
        search,
        result,
    }
}
export const actionCompleteSearch=()=>{
    return{
        type:actionConstants.COMPLETE_SEARCH
    }
}
export const actionSearch = (search) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            const urlSearch = search.Id !== undefined ? "busquedaavanzada" : "obtienesolicitudes";

            axios.post(urlSearch, search)
                .then(response => {
                    const ticketList = response.data.Solicitudes.map(ticket => {
                        return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }

                    })

                    /*
                    if (data.Problema.length !== 0 || data.Id > 0 || data.Atiende.length !== 0
                        || data.Solicitante.length !== 0 || data.Departamento.length !== 0 || data.Rango.length !== 0 || data.Resuelto) {
                        //Devolvemos en true, porque ya hay datos en los filtros.
                        this.props.setClean(true);
                    }*/
                    /*
                    //Pasar filtros al filtro principal
                    const departamento = this.getNombre(data.Departamento, "departamentos");
                    const rango = this.getNombre(data.Rango, "rangos");
                    const categoria = this.getNombre(data.Categoria, "categorias");
                    this.props.setInputClean(data, departamento, rango, categoria);
                    */
                    //Close Popover
                    /*
                   
                    */
                    dispatch(doSearch({search,isSearching:true}, ticketList));
                    resolve("busqueda exitosa");

                }).catch(reason => {
                    reject(reason);
                });
        });
    }

}

export const actionUpdateList = ticket => {
    return {
        type: actionConstants.UPDATELIST,
        ticket,
    }
}
const getCatalogs = (preferences, assistanceTypes, timeRanges) => {

    return {
        type: actionConstants.GET_CATALOGS,
        preferences,
        assistanceTypes,
        timeRanges,
    }
}
export const actionUpdatePreferences = (preferenceType, value) => {

    return {
        type: actionConstants.UPDATE_PREFERENCE,
        preferenceType,
        value,
    }
}
export const actionGetCatalogs = (username) => {

    return (dispatch) => {
        const data = {
            UsuarioLogin: username,
            operacion: "B",
            key: "columnas",
            value: "",
        }

        axios.post("trabajarpreferencias", data).then(response => {
            const preferences = response.data.preferences.reduce((previous, current) => {
                previous[current.key] = JSON.parse(current.value);
                return previous;
            }, {});
            const assistanceTypes = response.data.assistanceTypes;
            const timeRanges = response.data.Rangos;
            dispatch(getCatalogs(preferences, assistanceTypes, timeRanges));

        }).catch(reason => {
            console.log(reason);
        });
    }
}