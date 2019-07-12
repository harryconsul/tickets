import * as actionConstants from './action.constants';
import axios from 'axios';
export const actionLogin = user =>{
    return {
        type:actionConstants.LOGIN,
        user,
    }
}
export const actionSearch = result =>{
    return {
        type:actionConstants.SEARCH,
        result,
    }
}

export const actionUpdateList = ticket =>{
    return {
        type:actionConstants.UPDATELIST,
        ticket,
    }
}
const getCatalogs = (preferences,assistanceTypes) =>{
    
    return {
        type:actionConstants.GET_CATALOGS,
        preferences,
        assistanceTypes,
    }
}
export const actionUpdatePreferences = (preferenceType,value) =>{
    
    return {
        type:actionConstants.UPDATE_PREFERENCE,
        preferenceType,
        value,
    }
}
export const actionGetCatalogs = (username) =>{
   
    return (dispatch)=>{
        const data = {
            UsuarioLogin:username,
            operacion:"B",
            key:"columnas",
            value:"",
        }

        axios.post("trabajarpreferencias",data).then(response=>{
            const preferences =  response.data.preferences.reduce((previous,current)=>{
                previous[current.key]=JSON.parse(current.value);
                return previous;
            },{});
            const assistanceTypes =response.data.assistanceTypes;
            dispatch(getCatalogs(preferences,assistanceTypes));
            
        }).catch(reason=>{
            console.log(reason);
        });
    }
}