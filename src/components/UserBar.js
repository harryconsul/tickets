import React from 'react';
import {Avatar} from '@material-ui/core';
import {connect} from 'react-redux';


class  UserBar extends React.Component{
    render(){
        const photo = this.props.user ?this.props.user.photo:"";
        return(
            <Avatar src={photo}>
                
            </Avatar>
        )
    }

}
const mapStateToProps=state=>{
    return {
        user:state.user,
    }
}
export default connect(mapStateToProps)(UserBar)