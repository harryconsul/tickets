import React from 'react';
import {Stepper,Step,StepLabel,Typography} from '@material-ui/core';
import CategorySelection from './CategorySelection';
import RequestForm from './RequestForm';
import TicketSummary from '../components/TicketSummary';
import axios from 'axios';
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =()=>{
            resolve(reader.result)
        };
        reader.onerror=()=>{
            reject("No fue posible cargar el archivo");

        }
    }
    );
}
class NewTicketFlow extends React.Component{

    state={
        activeStep:0,
        steps:[{id:0,label:"Mi problema es del tipo",semantic:""},
            {id:1,label:"Descripción del problema",semantic:""},
            {id:2,label:"Ticket Registrado",semantic:""}],
        completed:[],
        problemType:{},
        problemDetail:{},
        ticketId:null,

    }
    nextStep=(semanticObject)=>{
        let {completed,activeStep,steps} = this.state;
        steps[activeStep].semantic=semanticObject.object.label;
        completed.push(activeStep);
        
        this.setState({activeStep:activeStep+1,completed:completed,steps:steps,
                        [semanticObject.element]:semanticObject.object});

    }
    
   async completeFileFields(){
        
        const postReadyFields=[]
        for(let i =0 ; i<this.state.problemDetail.fields.length;i++){
        const field = this.state.problemDetail.fields[i];
        if(["file","image"].indexOf(field.type)>=0){
            const base64Value = await getBase64(field.value);
            
            postReadyFields.push({...field,value:base64Value});
       }
       else{
           postReadyFields.push(field);
       }
    }
     return postReadyFields;


        
    }
    postTicket=(fields)=>{
        const data = {Solicitud:{
            user:"miguel.guzman",
            description: this.state.problemDetail.detail,
            problem: this.state.problemDetail.problem,
            problemId:0,
            categoryId : this.state.problemType.id,
            fields: fields,

        }};
        axios.post("registrarsolicitud",data).then(response=>{
            this.setState({ticketId:response.data.SolicitudId})
        }).catch(reason=>{
            console.log("Error ", reason);
        })
    }
    getActiveComponent=()=>{
        switch(this.state.activeStep){
            case 0:
                return <CategorySelection onComplete={this.nextStep} />;                
            case 1:
                return <RequestForm onComplete={this.nextStep} categoryId={this.state.problemType.id} />
            default:
                return <TicketSummary ticketNumber={this.state.ticketId} category={this.state.problemType.label}
                detail={this.state.problemDetail.detail} problem={this.state.problemDetail.problem} />
            
        }

    }
    componentDidUpdate(){
        if(this.state.activeStep===2 && this.state.ticketId===null){
            this.completeFileFields().then((postReadyFields)=>{this.postTicket(postReadyFields)});

        }
    }
    render(){
        

        return (

            <div>
                <FlowSteps {...this.state} />
                {
                    this.getActiveComponent()
                }
            </div>
        )
    }

}
const FlowSteps = props=>{
    return(
        <Stepper activeStep={props.activeStep} >
            {props.steps.map(step=>{
                return <Step key={step.id} completed={props.completed.indexOf(step.id)>=0} >
                    <StepLabel>
                        {step.label}
                        { 
                            step.semantic===""?null:
                            <Typography variant={'caption'}>{step.semantic}</Typography>
                        }
                    </StepLabel>
                </Step>;

            })}
        </Stepper>
        
    )

}

export default NewTicketFlow;