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
              slice: {
                rows: [
                    {
                        uniqueName: "Categoria"
                    },
                    {
                        uniqueName: "Usuario"
                    }
                ],
                columns: [
                    {
                        uniqueName: "Estatus"
                    },
                    {
                        uniqueName: "[Measures]"
                    }
                ],
                measures: [
                    {
                        uniqueName: "NoSolicitud",
                        "aggregation": "count"
                    }
                ],
                expands: {
                    rows: [
                        {
                            tuple: [
                                "categoria.[acceso a paginas web]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[altas , bajas y cambios]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[aplicaciones office 365]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[bi]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[capital humano]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[comodatos]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[comunicación con his]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[comunicación interhospitalaria]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[conexiones]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[correo electronico]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[enlaces de internet]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[excel]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[facturación / tralix]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[finanzas]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[hoja de resultado]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[impresoras]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[indicadores]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[interfaz con equipo]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[intranet]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[logistica]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[mi equipo]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[mi usuario]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[red inalambrica]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[reportes y estadisticas]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[skype]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[telefonia]"
                            ]
                        },
                        {
                            tuple: [
                                "categoria.[word]"
                            ]
                        }
                    ]
                }
            },
            datePattern: "GMT+1:dd-MMMM-yyyy",                 
            
        },
        ref:React.createRef(),
    }
   
    componentDidMount(){

        axios.post("reporteflexiblea").then((response)=>{
            const report = {...this.state.report};
            report.dataSource.data = response.data.SDTData;
            const flex = this.state.ref.current.flexmonster;
            this.setState({report},()=>
                //flex.updateData({...this.state.report.dataSource})
                flex.setReport(this.state.report)
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
