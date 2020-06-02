import React from 'react';
import * as PivotTableDR from './PivotTableDR';
//import * as FlexmonsterReact from 'react-flexmonster';
//import 'flexmonster/flexmonster.min.css';

import axios from 'axios';
import {Paper} from '@material-ui/core'
class PivotTable extends React.Component {
    state={
        ref:React.createRef(),
    }
    postData=()=>{
        console.warn('rango',this.props.data);  
        axios.post(this.props.webService,this.props.data).then((response)=>{
            const report = {...this.props.report};
            report.dataSource.data = response.data.SDTData;
            console.warn(this.state.ref.current);
            //const flex = this.state.ref.current.flexmonster;            
            //flex.setReport(report);

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
                {/*
                <FlexmonsterReact.Pivot  ref={this.state.ref}                          
                 toolbar={true}
                 report={this.state.report}
                 licenseKey="Z7QE-XCC244-3E3C4S-193J3N"
                     />
                */
                    <PivotTableDR.Pivot toolbar={true} report="https://cdn.webdatarocks.com/reports/report.json"/>
                }
            </Paper>
        )
    }
}
export default PivotTable;
