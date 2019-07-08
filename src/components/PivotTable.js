import React from 'react';
import * as FlexmonsterReact from 'react-flexmonster';
import 'flexmonster/flexmonster.min.css';
import axios from 'axios';
class PivotTable extends React.Component {
    state={
        report:{
            dataSource: {
                dataSourceType: "json",
                data: [],
              },
              
              options: {
                configuratorActive: false
              }
        },
        ref:React.createRef(),
    }
   
    componentDidMount(){

        axios.post("reporteflexiblea").then((response)=>{
            const report = {...this.state.report};
            report.dataSource.data = response.data.SDTData;
            const flex = this.state.ref.current.flexmonster;
            this.setState({report},()=>
                flex.updateData({...this.state.report.dataSource})
            );

        });

    }
   
    render() { 
        return (
            <div className="App">
                <FlexmonsterReact.Pivot  ref={this.state.ref}   
                 reportchange={this.onReportChange}        
                 toolbar={true}
                 report={this.state.report}
                 licenseKey="Z7O9-XI8B41-5G2L3U-0G0V3Q-5W4N1X-1B455K-0K4P5R-4Q5T6Q-1L063R-6E6D"
                     />
            </div>
        )
    }
}
export default PivotTable;
