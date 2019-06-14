import * as actionConstants from '../../actions/action.constants';


const sessionReducer = (state={user:null,result:[]},action)=>{
    switch(action.type){
        case actionConstants.LOGIN:
            return {
                ...state,
                user:action.user
            }
        case actionConstants.SEARCH:
                return {
                    ...state,
                    result:action.result
                }
             
           
        default:
            return state;
    }  

}
export default sessionReducer;