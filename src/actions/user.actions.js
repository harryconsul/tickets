import * as actionConstants from './action.constants';

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