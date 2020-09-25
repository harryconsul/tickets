import * as actionConstants from '../../actions/action.constants';
const initialState = {
    user: null,
    result: [],
    preferences: {},
    assistanceTypes: [],
    timeRanges: [],
    search: {

    },
    page: 0,

}

const sessionReducer = (state = initialState, action) => {
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
                search: action.search,
            }
        case actionConstants.UPDATELIST:

            return {
                ...state,
                result: updateResults(state.result, action.ticket),
            }
        case actionConstants.GET_CATALOGS:

            return {
                ...state,
                preferences: action.preferences,
                assistanceTypes: action.assistanceTypes,
                timeRanges: action.timeRanges,
            }
        case actionConstants.UPDATE_PREFERENCE:

            return {
                ...state,
                preferences: { ...state.preferences, [action.preferenceType]: action.value, },


            }
        case actionConstants.COMPLETE_SEARCH:
            return {
                ...state,
                search: {
                    ...state.search,
                    isSearching: false,
                }
            }
        case actionConstants.CHANGE_PAGE:
            return {
                ...state,
                page: action.page
            }
        case actionConstants.MYTICKETS:
            return {
                ...state,
                myTickets: action.myTickets
            }
        case actionConstants.INPROCESS:
            return {
                ...state,
                inProcess: action.inProcess
            }

        default:
            return state;
    }

}

//Clonar los resultados y solo actualizar la linea afectada. 
const updateResults = (results, item) => {
    const newResults = results.map(result => ({ ...result }));
    const indexOf = newResults.findIndex(result => item.id === result.id);
    if (indexOf >= 0) {
        newResults[indexOf] = { ...newResults[indexOf], ...item }
    }
    return newResults


}
export default sessionReducer;