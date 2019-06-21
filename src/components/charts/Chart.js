import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

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
        
        this.state = {
            gradientApplied:false,
            data: {
                

            },
        }
        
    }
    componentDidUpdate(){
        if (this.props.hasGradient && !this.state.gradientApplied) {
            this.setState( {
                gradientApplied:true,
                data: {
                    ...this.state.data
                    ,colors: Highcharts.map(this.state.data.colors, function (color) {
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
                    })
                }

            });

        }

    }
    componentDidMount() {
        const data = this.props.feedPayload?this.props.feedPayload:null;
        axios.post(this.props.feed,data).then(response => {

            const properData = {
                ...response.data.SDTGrafica,
                series: formatSeries(response.data.SDTGrafica.series),
            }
            console.log(properData);
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