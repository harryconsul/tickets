import React from 'react';
import { Stepper, Step, StepLabel, Typography, StepButton } from '@material-ui/core';
import CategorySelection from './CategorySelection';
import RequestForm from './RequestForm';
import SummitAck from '../components/SummitAck';
import { statusCodes } from '../constants'
import axios from 'axios';
import GraphSDKHelper from '../helpers/GraphSdkHelper';
import SnackBarMessage from '../components/SnackBarMesssage/SnackBarMessage';
import { connect } from 'react-redux';
import Graph from '../helpers/GraphSdkHelper';

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
            reject("No fue posible leer el contenido del archivo, tal vez este vacío");
        }
    }
    );
}
const baseSteps = () => {
    const initialSteps = [{ id: 0, label: "Mi solicitud es del tipo", semantic: "" },
    { id: 1, label: "Descripción de la solicitud", semantic: "" },
    { id: 2, label: "Solicitud registrada", semantic: "" }];

    return initialSteps.map(step => ({ ...step, semantic: "" }));


}

class NewTicketFlow extends React.Component {
    constructor(props) {
        super(props);

        this.helper = new Graph(this.props.user.accessToken);
    }
    state = {
        activeStep: 0,
        steps: baseSteps(),
        completed: [],
        problemType: {},
        problemDetail: {},
        ticketId: null,
        engineerPhoto: "",

    }
    resetFlow = () => {
        this.setState({
            activeStep: 0,
            completed: [],
            problemType: {},
            problemDetail: {},
            ticketId: null,
            steps: baseSteps(),
            snackOpen: false,
            errorMessage: "",
            engineerPhoto: "",
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
                try {
                    const base64Value = await getBase64(field.value);

                    postReadyFields.push({ ...field, value: base64Value });
                } catch (e) {
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
        if (this.props.user.isManager) {
            const user = this.state.problemDetail.user

            axios.post("registrausuario", { user })
                .then(response => {
                    this.postRegistrarSolicitud(user.username, fields);
                })
                .catch(error => {
                    this.setState({
                        snackOpen: true,
                        errorMessage: ":( Ups tenemos un problema registrando al usuario que solicita ,reporta este problema al administrador del sistema",
                        ticketId: "####",
                    });
                });
        } else {
            this.postRegistrarSolicitud(this.props.user.username, fields);
        }
    }

    getNotificacion = (id) => {
        const data = {
            Id: id,
            Estatus: statusCodes.NEW.value,
            Comentario: ''
        }

        axios.post("buscarnotificacion", data).then(response => {
            const correo = response.data.Notificacion.Para;
            console.log(correo);
            if (correo !== '') {
                const recipient = [{
                    EmailAddress: {
                        Address: correo
                    }
                }];

                this.helper.sendMail(recipient, response.data.Notificacion.Asunto,
                    response.data.Notificacion.Correo, (err) => {
                        if (!err) {
                            console.log("La notificación fue enviada");
                        }
                    });
            }
        });
    }

    postRegistrarSolicitud = (username, fields) => {
        const data = {
            Solicitud: {
                user: username,
                description: this.state.problemDetail.detail,
                problem: this.state.problemDetail.problem,
                problemId: 0,
                categoryId: this.state.problemType.id,
                fields: fields,
                registro: this.props.user.username

            }
        };

        axios.post("registrarsolicitud", data).then(response => {
            this.setState({ ticketId: response.data.SolicitudId })
            const helper = new GraphSDKHelper(this.props.user.accessToken);
            helper.getProfilePics([{ id: response.data.UsuarioID, photo: "" }], (photos) => {
                if (photos.length) {
                    this.setState({ engineerPhoto: photos[0].photo });
                }
            });

            /*No aplica la notificación desde el cliente.
            const { user, registro } = data.Solicitud;
            if (user !== registro) {
                this.getNotificacion(response.data.SolicitudId);
            }
            */
        }).catch(reason => {
            this.setState({
                snackOpen: true,
                errorMessage: ":( Ups tuvimos un problema registrando tu reporte , revisa en tu bandeja si logro registrarse",
                ticketId: "####",
            });
        })
    }
    getActiveComponent = () => {
        switch (this.state.activeStep) {
            case 0:
                return <CategorySelection onComplete={this.nextStep} />;
            case 1:
                return <RequestForm onComplete={this.nextStep} categoryId={this.state.problemType.id}
                    isAdmin={this.props.user.isManager} />
            default:
                return <SummitAck
                    ticketNumber={this.state.ticketId}
                    category={this.state.problemType.label}
                    detail={this.state.problemDetail.detail}
                    status={statusCodes.NEW.value}
                    resetFlow={this.resetFlow}
                    photo={this.state.engineerPhoto}
                    problem={this.state.problemDetail.problem} 
                    logOut={this.logOut}/>

        }

    }

    componentDidUpdate() {
        if (this.state.activeStep === 2 && this.state.ticketId === null) {
            this.completeFileFields().then((postReadyFields) => { this.postTicket(postReadyFields) });

        }
    }

    logOut = () => {
        this.props.user.logout()
    }

    render() {


        return (

            <div>

                <FlowSteps {...this.state} resetFlow={this.resetFlow} />
                {
                    this.getActiveComponent()
                }
                <SnackBarMessage open={this.state.snackOpen} variant="error"
                    handleClose={() => this.setState({ errorMessage: "", snackOpen: false })}
                    autoHideDuration={10000}
                    message={this.state.errorMessage} />
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