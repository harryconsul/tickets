import * as actionConstants from '../../actions/action.constants';


const sessionReducer = (state = { user: null, result: [], preferences: {}, assistanceTypes: [] }, action) => {
    switch (action.type) {
        case actionConstants.LOGIN:
            return {
                ...state,
                user: action.user
            }
        case actionConstants.SEARCH:
            return {
                ...state,
                result: action.result,
            }
        case actionConstants.UPDATELIST:

            return {
                ...state,
                result: updateResults(state.result, action.ticket),
            }
        case actionConstants.GET_CATALOGS:

            return {
                ...state,
                preferences:action.preferences,
                assistanceTypes:action.assistanceTypes,
            }


        default:
            return state;
    }

}
const updateResults = (results, item) => {
    const newResults = results.map(result => ({ ...result }));
    const indexOf = newResults.findIndex(result => item.id === result.id);
    if (indexOf >= 0) {
        newResults[indexOf] = { ...newResults[indexOf], ...item }
    }
    return newResults


}
export default sessionReducer;