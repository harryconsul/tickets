import React from 'react';
import { Stepper, Step, StepLabel, Typography, StepButton } from '@material-ui/core';
import CategorySelection from './CategorySelection';
import RequestForm from './RequestForm';
import SummitAck from '../components/SummitAck';
import {statusCodes} from '../constants'
import axios from 'axios';
import {connect} from 'react-redux';
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        try {
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = () => {
                reject("No fue posible cargar el archivo");

            }
        } catch (error) {
            reject("No fue posible leer el contenido del archivo, talvez este vacio");
        }
    }
    );
}
const baseSteps = () => {
    const initialSteps = [{ id: 0, label: "Mi solicitud es del tipo", semantic: "" },
    { id: 1, label: "Descripción del solicitud", semantic: "" },
    { id: 2, label: "Reporte Registrado", semantic: "" }];

    return initialSteps.map(step => ({ ...step, semantic: "" }));


}

class NewTicketFlow extends React.Component {

    state = {
        activeStep: 0,
        steps: baseSteps(),
        completed: [],
        problemType: {},
        problemDetail: {},
        ticketId: null,

    }
    resetFlow = () => {
        this.setState({
            activeStep: 0,
            completed: [],
            problemType: {},
            problemDetail: {},
            ticketId: null,
            steps: baseSteps(),
        });
    }
    nextStep = (semanticObject) => {
        let { completed, activeStep, steps } = this.state;
        steps[activeStep].semantic = semanticObject.object.label;
        completed.push(activeStep);

        this.setState({
            activeStep: activeStep + 1, completed: completed, steps: steps,
            [semanticObject.element]: semanticObject.object
        });

    }

    async completeFileFields() {

        const postReadyFields = []
        for (let i = 0; i < this.state.problemDetail.fields.length; i++) {
            const field = this.state.problemDetail.fields[i];
            if (["file", "image"].indexOf(field.type) >= 0) {
                try{
                const base64Value = await getBase64(field.value);
                
                postReadyFields.push({ ...field, value: base64Value });
                }catch(e){
                    postReadyFields.push(field);  
                }
            }
            else {
                postReadyFields.push(field);
            }
        }
        return postReadyFields;



    }
    postTicket = (fields) => {
        console.log(this.props.user.username);
        const data = {
            Solicitud: {
                user: this.props.user.username,
                description: this.state.problemDetail.detail,
                problem: this.state.problemDetail.problem,
                problemId: 0,
                categoryId: this.state.problemType.id,
                fields: fields,

            }
        };
        axios.post("registrarsolicitud", data).then(response => {
            this.setState({ ticketId: response.data.SolicitudId })
        }).catch(reason => {
            console.log("Error ", reason);
        })
    }
    getActiveComponent = () => {
        switch (this.state.activeStep) {
            case 0:
                return <CategorySelection onComplete={this.nextStep} />;
            case 1:
                return <RequestForm onComplete={this.nextStep} categoryId={this.state.problemType.id} />
            default:
                return <SummitAck ticketNumber={this.state.ticketId}
                    category={this.state.problemType.label}
                    detail={this.state.problemDetail.detail}
                    status={statusCodes.NEW.value}
                    resetFlow={this.resetFlow}
                    problem={this.state.problemDetail.problem} />

        }

    }
    componentDidUpdate() {
        if (this.state.activeStep === 2 && this.state.ticketId === null) {
            this.completeFileFields().then((postReadyFields) => { this.postTicket(postReadyFields) });

        }
    }
    render() {


        return (

            <div>
               
                <FlowSteps {...this.state} resetFlow={this.resetFlow} />
                {
                    this.getActiveComponent()
                }
            </div>
        )
    }

}
const FlowSteps = props => {
    return (
        <Stepper activeStep={props.activeStep} >
            {props.steps.map(step => {
                const isCompleted = props.completed.indexOf(step.id) >= 0;
                const itemContent = (<React.Fragment>
                    {step.label}
                    {
                        step.semantic === "" ? null :
                            <Typography variant={'caption'}>{step.semantic}</Typography>
                    }
                </React.Fragment>);
                return <Step key={step.id} completed={isCompleted} >
                    {step.id === 0 ?
                        <StepButton onClick={props.resetFlow}>
                            {itemContent}
                        </StepButton> :
                        <StepLabel>
                            {itemContent}
                        </StepLabel>
                    }
                </Step>;

            })}
        </Stepper>

    )

}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(NewTicketFlow);