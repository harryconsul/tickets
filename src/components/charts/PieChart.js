import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

import HighChart from 'highcharts-react-official';
import axios from 'axios';
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
class PieChart extends React.Component {
    constructor(props) {
        super(props);
        HighchartsMore(Highcharts);
        SolidGauge(Highcharts)
        if (props.hasGradient) {
            this.state = {
                data: {
                    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                        return {
                            radialGradient: {
                                cx: 0.5,
                                cy: 0.3,
                                r: 0.7
                            },
                            stops: [
                                [0, color],
                                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                            ]
                        };
                    })
                }

            }

        } else {
            this.state = {
                data: {
                    

                },
            }
        }
    }
   
    componentDidMount() {

        axios.post("graficagaugetickets", { Anio: 2019, Mes: 6 }).then(response => {

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
export default PieChart;