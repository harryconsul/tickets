import React from 'react';
import * as FlexmonsterReact from 'react-flexmonster';
import 'flexmonster/flexmonster.min.css';
import axios from 'axios';
import {Paper} from '@material-ui/core'
class PivotTable extends React.Component {
    state={
        ref:React.createRef(),
    }
   
    componentDidMount(){

        axios.post(this.props.webService).then((response)=>{
            const report = {...this.props.report};
            report.dataSource.data = response.data.SDTData;
            const flex = this.state.ref.current.flexmonster;            
            flex.setReport(report);
          

        });

    }
   
    render() { 
        return (
            <Paper style={{padding:"10px"}} >
                <FlexmonsterReact.Pivot  ref={this.state.ref}   
                 reportchange={this.onReportChange}        
                 toolbar={true}
                 report={this.state.report}
                 licenseKey="Z7O9-XI8B41-5G2L3U-0G0V3Q-5W4N1X-1B455K-0K4P5R-4Q5T6Q-1L063R-6E6D"
                     />
            </Paper>
        )
    }
}
export default PivotTable;
