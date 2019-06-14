import React from 'react';
import highcharts from 'highcharts';
import HighChart from 'highcharts-react-official';
import axios from 'axios';
const formatSeries=series=>{
    return series.map(serie=>{
        return {...serie,data:serie.data.map(item=>{
                const properItem = {...item};
                if(properItem.x){
                    properItem.x = Number(properItem.x);
                }
                if(properItem.y){
                    properItem.y = Number(properItem.y);
                }
                return properItem;

            })           
        }
    });
}
class PieChart extends React.Component{
    state={
        data:{},
    }
    componentDidMount(){

        axios.post("graficapiedepartamentos",{Anio:2019,Mes:6}).then(response=>{
            
            const properData = {
                ...response.data.SDT_GraficaPie,
                series:formatSeries(response.data.SDT_GraficaPie.series),                
            }
            console.log(properData);
            this.setState({data:properData});

        });
    }
    render(){
        return(
            <HighChart highcharts={highcharts} options={this.state.data} />
        )
    }
}
export default PieChart;