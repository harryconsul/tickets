import React from 'react';
import * as FlexmonsterReact from 'react-flexmonster';
import 'flexmonster/flexmonster.min.css';

import axios from 'axios';
import {Paper} from '@material-ui/core'
class PivotTable extends React.Component {
    state={
        ref:React.createRef(),
    }
    postData=()=>{
        axios.post(this.props.webService,this.props.data).then((response)=>{
            const report = {...this.props.report};
            report.dataSource.data = response.data.SDTData;
            const flex = this.state.ref.current.flexmonster;            
            flex.setReport(report);
          

        });
    }
    componentDidMount(){

        this.postData();

    }
    componentDidUpdate(){
        this.postData();
    }
   
    render() { 
        return (
            <Paper style={{padding:"10px"}} >
                <FlexmonsterReact.Pivot  ref={this.state.ref}                          
                 toolbar={true}
                 report={this.state.report}
                 licenseKey="Z7LB-XBI30F-160R3S-3I6L56"
                     />
            </Paper>
        )
    }
}
export default PivotTable;
