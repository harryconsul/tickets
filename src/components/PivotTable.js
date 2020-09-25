import React from 'react';
import * as PivotTableDR from './PivotTableDR';
//Ahora WebDataRocks: import * as FlexmonsterReact from 'react-flexmonster';
//import 'flexmonster/flexmonster.min.css';

import axios from 'axios';
import { Paper } from '@material-ui/core'
class PivotTable extends React.Component {
    state = {
        ref: React.createRef(),
    }
    postData = () => {
        axios.post(this.props.webService, this.props.data).then((response) => {
            const report = { ...this.props.report };
            report.dataSource.data = response.data.SDTData;
            const datarocks = this.state.ref.current.webdatarocks;
            datarocks.setReport(report);

        });
    }
    componentDidMount() {

        this.postData();

    }
    componentDidUpdate() {
        this.postData();
    }

    render() {
        return (
            <Paper style={{ padding: "10px" }} >
                {
                    <PivotTableDR.Pivot
                        toolbar={true}
                        ref={this.state.ref}
                        report={this.state.report} />
                }
            </Paper>
        )
    }
}
export default PivotTable;
