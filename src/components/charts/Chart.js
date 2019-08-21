import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import Data from 'highcharts/modules/data';
import Drilldown from 'highcharts/modules/drilldown';
import HighChart from 'highcharts-react-official';
import axios from 'axios';
import  './Chart.css';
const formatSeries = series => {
    return series.map(serie => {
        const formatedSerie  = {
            ...serie, data: typeof(serie.data) ==="object"?serie.data :( serie.data.map(item => {
                const properItem = { ...item };
                if (properItem.x) {
                    properItem.x = Number(properItem.x);
                }
                if (properItem.y) {
                    properItem.y = Number(properItem.y);
                }
                return properItem;

            }))
        }
        if(formatedSerie.dataLabels){
            formatedSerie.dataLabels.format= formatedSerie.dataLabels.format.replace("\\","");
        }
       
        return formatedSerie;
    });
}
class Chart extends React.Component {
    constructor(props) {
        super(props);
        HighchartsMore(Highcharts);
        SolidGauge(Highcharts)
        Drilldown(Highcharts);
        Data(Highcharts);
        
        this.state = {
            gradientApplied:false,
            data: {
                
                plotOptions:{
                    series:{
                        point:{
                            events:{
                                click:(event)=>{
                                    if(typeof(event.point.id) === "number" ){
                                        
                                       
                                        this.fetchGraphData("graficabarrascategorias",{UsuarioLogin:this.props.feedPayload.UsuarioLogin,DepartamentoId:event.point.id});

                                    }
                                }
                            }
                        }
                    }
                }  

            },
            
        }
        
    }
    componentDidUpdate(){
        if (this.props.hasGradient && !this.state.gradientApplied) {
            this.setState( {
                gradientApplied:true,
                data: {
                    ...this.state.data
                    ,colors:this.state.data.colors?
                         Highcharts.map(this.state.data.colors, function (color) {
                        return {
                            radialGradient: {
                                cx: 0.5,
                                cy: 0.3,
                                r: 0.7
                            },
                            stops: [
                                [0, color],
                                [1, Highcharts.Color(color).brighten(-0.15).get('rgb')] // darken
                            ]
                        };
                    }):[],
                }

            });

        }

    }
    componentDidMount() {
       
        this.fetchGraphData();
        
    }
    fetchGraphData=(serviceURL=null,data=null)=>{

        const _data = data?data:(
                 this.props.feedPayload?this.props.feedPayload:null);
        const _serviceURL = serviceURL?serviceURL:this.props.feed;

        axios.post(_serviceURL,_data).then(response => {
            
            const properData = {
                ...response.data.SDTGrafica,
                chart:{
                    ...response.data.SDTGrafica.chart,
                    style:{ 
                        fontFamily:["Roboto","Helvetica","Arial","san-serif"],
                     },
                     
                },
                plotOptions:{
                    ...response.data.SDTGrafica.plotOptions,
                    series:
                        response.data.SDTGrafica.plotOptions.series?
                     {...response.data.SDTGrafica.plotOptions.series}
                        :{...this.state.data.plotOptions.series}
                    ,
                },
                series: formatSeries(response.data.SDTGrafica.series),
            }
            if(properData.drilldown){
                const drilldownSeries =properData.drilldown.series.map(item=>{
                    const data = item.data.map(dataItem=>{
                           let dataArray= dataItem.replace('[','').replace(']','').split(',');
                           dataArray[0]=dataArray[0].replace("'",'');
                           dataArray[1]=Number(dataArray[1]);
                           return dataArray;
                        });
                    return {...item,data}
    
                });
                
                properData.drilldown.series = drilldownSeries;
            }
            if(properData.yAxis){
                if(properData.yAxis.stops){
                    //set correct form of this array
                   
                    properData.yAxis.stops= properData.yAxis.stops.map(dataItem=>{
                        let dataArray= dataItem.replace('[','').replace(']','').split(',');
                        dataArray[0]=Number(dataArray[0]);
                        dataArray[1]=dataArray[1].replace("'",'').replace("'",'');
                        return dataArray;
                     });

                }
            }
            
            
            this.setState({ data: properData });
            
               
            

        });
    }
    render() {
        return (
            <HighChart highcharts={Highcharts} options={this.state.data} />
        )
    }
}
export default Chart;