import React from 'react';
import { Route ,Redirect} from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import PieChart from '../components/charts/PieChart';
import IssuesManager from './IssuesManager';
import {connect} from 'react-redux';
class Admin extends React.Component {
    constructor(props){
        super(props);
        
        if(props.user===null){
            props.history.push("/");
        }
    }
    render() {
        
        return (
            <div>
                {this.props.user===null?<Redirect to="/" /> : null}
                <MenuBar currentOption={this.props.location.pathname} history={this.props.history} />
                <div style={{ marginTop: "50px" }}>
                    <Route path="/admin/" component={IssuesManager} />
                    <Route path="/admin/graficas" component={()=><PieChart hasGradient={false} />} />
                </div>
            </div>

        )
    }
}

const mapStateToProps=state=>{
    return {user:state.user};
}
export default connect(mapStateToProps)(Admin);
