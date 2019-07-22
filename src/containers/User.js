import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import IssuesManager from './IssuesManager';
import NewTicketFlow from './NewTicketFlow';
import {connect} from 'react-redux';
import MenuBar from '../components/MenuBar';


class User extends React.Component {

    state={
        ref:React.createRef(),
        margin:"0",
    }
    componentDidMount(){
        
        const style = window.getComputedStyle(this.state.ref.current.children[0]);
            
        const margin = Number(style.height.replace("px",""));
        this.setState({margin})

    }
    render(){
        return (
            <div>
                
                <MenuBar currentOption={this.props.location.pathname} 
                    isManager={false} barRef={this.state.ref} textColor={"white"}
                history={this.props.history} />
                <div style={{marginTop:this.state.margin}}>
                    <Route  path="/" component={IssuesManager} />
                    <Route path="/nueva-solicitud" component={NewTicketFlow} />
                </div>
            </div>

        )
    }

};


const mapStateToProps=state=>{
    return {
        user:state.user,
        timeRanges:state.timeRanges,
    
    };
}
export default withRouter(connect(mapStateToProps)(User));
