import React from 'react';
import { Route,Redirect } from 'react-router-dom';
import NewTicketFlow from './NewTicketFlow';
import {connect} from 'react-redux';
class User extends React.Component {
    
    render() {
        return (
            this.props.user===null?<Redirect to="/" />:
            <Route path="/" component={NewTicketFlow} />
        )
    }
}
const mapStateToProps=state=>{
    return {user:state.user};
}
export default connect(mapStateToProps)(User);
