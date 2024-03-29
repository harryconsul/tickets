import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import Dashboard from '../containers/Dashboard';
import IssuesManager from './IssuesManager';
import NewTicketFlow from './NewTicketFlow'
import MapOrganization from './MapOrganization'
import { connect } from 'react-redux';
import PivotLayout from '../components/PivotLayout';
//import TicketList from './TicketList';

class Admin extends React.Component {
    state = {
        ref: React.createRef(),
        margin: "0",
    }
    componentDidMount() {

        const style = window.getComputedStyle(this.state.ref.current.children[0]);

        const margin = Number(style.height.replace("px", ""));
        this.setState({ margin })

    }
    render() {

        return (
            <div>

                <MenuBar
                    currentOption={this.props.location.pathname}
                    profile={this.props.user.profile}
                    isManager={true}
                    barRef={this.state.ref}
                    textColor={"white"}
                    history={this.props.history} />
                <div style={{ marginTop: this.state.margin }}>
                    <Route path="/mis-solicitudes/" component={IssuesManager} />
                    {/* <Route path="/mis-solicitudes/" component={TicketList} /> */}
                    <Route path="/graficas" component={() => <Dashboard usuario={this.props.user.username} />} />
                    <Route path="/reportes" component={() => <PivotLayout usuario={this.props.user.username} timeRanges={this.props.timeRanges} />} />
                    <Route path="/nueva-solicitud" component={NewTicketFlow} />
                    <Route path="/organizacion" component={MapOrganization} />
                </div>
                <Redirect from='/' to='/mis-solicitudes' />
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        timeRanges: state.timeRanges,

    };
}
export default withRouter(connect(mapStateToProps)(Admin));
