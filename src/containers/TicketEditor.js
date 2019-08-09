import React from 'react';
import TicketSummary from '../components/TicketSummary';
import ThirdDialogForm from '../components/ThirdDialogForm'
import PromiseDate from '../components/PromiseDate';
import AssistanceType from '../components/AssistanceType';
import Comment from '../components/Comment';
import TicketField from '../components/TicketField';
import StatusAvatar from '../components/StatusAvatar';
import { Paper, Grid, TextField, Avatar } from '@material-ui/core'
import { FabProgress, ButtonProgress } from '../components/ButtonsProgress/ButtonsProgress';
import FileCancel from 'mdi-material-ui/FileCancel';
import Send from 'mdi-material-ui/Send';
import Check from 'mdi-material-ui/Check';
import axios from 'axios';
import Graph from '../helpers/GraphSdkHelper';
import { connect } from 'react-redux';
import { statusCodes } from '../constants';
import { actionUpdateList } from '../actions/user.actions';
import SnackBarMessage from '../components/SnackBarMesssage/SnackBarMessage';
import {history} from '../helpers/history';

const canBeOn = status => {
    if (status !== statusCodes.SOLVED.value
        && status !== statusCodes.REJECTED.value) {
        return true;
    }
    return false;

}


class TicketEditor extends React.Component {
    constructor(props) {
        super(props);
        let tecnico  = props.engineer?props.engineer.trim():"";
        tecnico = tecnico===""?props.loggedUser.username:tecnico;
        
        this.state = {
            comments: "",
            thirdPart: 0,
            postList: [],
            fields: [],
            isDialogOpen: false,
            thirds: [],
            usersIDs: [],
            currentStatus: props.status,
            currentCategoryName: props.categoryName,
            currentTecnico : tecnico,
            currentCategoryId: props.categoryId,
            userPhoto: "",
            engineerPhoto:"",
            snackOpen:false,
            message: '',

        }
        this.promiseDate = props.promiseDate;
        this.assistance = props.assistance;
        this.finishDate = props.finishDate;
        this.helper = new Graph(this.props.loggedUser.accessToken);

    }
    /*shouldComponentUpdate(nextProps,nextState){
        if(
            nextState.currentStatus!==this.state.currentStatus ||
            nextState.postList.length!==this.state.postList.length ||
            nextState.fields.length!==this.state.fields.length ||
            nextState.isDialogOpen!==this.state.isDialogOpen ||
            nextState.comments!==this.state.comments ||
            nextState.thirdPart!==this.state.thirdPart ||
            nextState.userPhoto!==this.state.userPhoto ||
            nextState.engineerPhoto!==this.state.engineerPhoto
        ){
            return true;
        }
        return false;
    }*/

    getNotificacion = (status, comments) => {
        const data = {
            Id: this.props.id,
            Estatus: status,
            Comentario: comments
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

                this.helper.sendMail(recipient , response.data.Notificacion.Asunto,
                    response.data.Notificacion.Correo , (err) =>{
                        if (!err) {
                            console.log("La notificación fue enviada");
                        }
                    });
            }

        });
    }

    handleSubmit = (_status, _comments, _showSnackBar, finishCallBack) => {
        const { thirdPart } = this.state;
        const status = _status === statusCodes.NEW.value && this.props.loggedUser.isManager ?
            statusCodes.IN_PROCESS.value :
            _status
        const comments = _comments ? _comments : this.state.comments;
        
        const data = {
            status,
            comments,
            thirdPart,
            id: this.props.id,
            user: this.props.loggedUser.username,
        }
        axios.post("grabarseguimiento", data).then(response => {
            if (status === statusCodes.SOLVED.value
                || status === statusCodes.REJECTED.value) {
                this.finishDate = response.data.post.date;
            }
            if (finishCallBack) {
                finishCallBack();
            }

            
                const post = {
                    ...response.data.post,photo:this.props.loggedUser.photo
                }

                this.setState({
                    comments: "",
                    postList: [post, ...this.state.postList],
                    currentStatus: status,
                },this.dispatchTicketChanges);
            
            //Buscar si hay algo que notificar.
            this.getNotificacion(status, comments);

            //Mostrar SnackBar Message, cuando ESTATUS sea RESUELTO
            if(status === statusCodes.SOLVED.value && _showSnackBar){
                const message = "Ha finalizado la solicitud " + this.props.id;
                this.setState({
                    snackOpen:true,
                    message: message,
                })
                setTimeout(()=>{
                    history.push("/mis-solicitudes");
                },3000);
                
            }


        }).catch(reason => {
            console.log(reason);
        });

    }

    handleSnackBarClose = (event, reason) =>{
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            snackOpen: false,
        })
    }

    handleDialogClose = (isOKClicked, third) => {

        if (isOKClicked) {
            console.log("third", third);

            this.setState({ thirdPart: third, isDialogOpen: false }, () => this.handleSubmit(statusCodes.THIRD.value, null, false, this.finishCallBack));


        } else {
            this.setState({ isDialogOpen: false });
            if (this.finishCallBack) {
                this.finishCallBack();
                this.finishCallBack = null;
            }

        }


    }
    changeCategory = (category) => {
        axios.post("cambiarcategoria", {
            SolicitudId: this.props.id,
            CategoriaId: category,
            UsuarioLogin: this.props.loggedUser.username,

        }).then(response => {
            this.setState({ currentCategoryName: response.data.categoryName },this.dispatchTicketChanges())
        })
    }

    changeTecnico = (tecnico) => {
        axios.post("cambiartecnico",{
            SolicitudId: this.props.id,
            UsuarioLogin: this.props.loggedUser.username,
            Tecnico: tecnico
        }).then(response => {
            this.setState({currentTecnico:tecnico},this.dispatchTicketChanges());

        });
    }

    changePromiseDate = (promiseDate) => {
        this.promiseDate = promiseDate;
        this.dispatchTicketChanges();
    }
    changeAssistance = (assistance) => {
        this.assistance = assistance;
        this.dispatchTicketChanges();
    }
    dispatchTicketChanges(){
        console.log("status",this.state.currentStatus);
        this.props.dispatch(actionUpdateList({
            id: this.props.id,
            status: this.state.currentStatus,
            promiseDate: this.promiseDate,
            finishDate: this.finishDate,
            assistance: this.assistance,
            engineer:this.state.currentTecnico,
            statusAvatar: <StatusAvatar status={this.state.currentStatus} />,
        }));
    }
    
    getPhoto = (users, posts) => {

        this.helper.getProfilePics(users, (photos) => {
            this.setState({
                usersIDs: photos,
                postList: posts.map(post => {
                    for (let i = 0; i < photos.length; i++) {
                        if (photos[i].id === post.userID) {
                            post.photo = photos[i].photo;
                        }
                    }
                    return post;
                })
            });
        })

    }
    componentDidMount() {
        //this.setState({currentStatus:this.props.status})

        axios.post("obtienedetallesolicitud", { id: this.props.id }).then(response => {
            //Get the picture to display in the ticket summary
            this.helper.getProfilePics([{ id: response.data.engineerUserID, photo: "" }], (photos) => {
                if (photos.length) {
                    this.setState({ engineerPhoto: photos[0].photo });
                }
            }); 
            
            const userIDs = response.data.userIDs.map(item => {
                return {
                    id: item,
                    photo: ""
                }
            });
            
            this.getPhoto(userIDs, response.data.posts);

            this.setState({
                fields: response.data.fields
                , thirds: response.data.thirds.map(item => ({ nombre: item.name, value: item.id }))


            },()=>{
                this.helper.getProfilePics([{ id: this.props.userID, photo: "" }], (photos) => {
                    if (photos.length) {
                        this.setState({ userPhoto: photos[0].photo });
                    }
                });
                if (this.props.loggedUser.isManager) {
                    if (this.state.currentStatus === statusCodes.NEW.value) {
        
                        this.handleSubmit(statusCodes.IN_PROCESS.value, "Asignación al responsable");
        
                    }
                }
            });
            
        });

       
      
       
    }
    render() {
        const postList = this.state.postList.map((post, index) => {
            return <Comment key={index} author={post.userFullName} date={post.date}
                third={post.third}
                comment={post.comments} photo={post.photo} />;
        });
        const _canBeOn = canBeOn(this.state.currentStatus);
        const isManager = this.props.loggedUser.isManager;
        const submitDisabled = !(this.state.comments !== "" && (_canBeOn || !isManager))
        const submitComment = !(this.state.comments !== "")
        const photo = this.props.loggedUser ? this.props.loggedUser.photo : "";
        const summaryPhoto = isManager ? this.state.userPhoto: this.state.engineerPhoto;
        return (
            <React.Fragment>
                <Grid container style={{ marginTop: "10px" }} >
                    <Grid container direction={"column"} style={{ padding: "2%" }}
                        item md={4} spacing={8}>
                        <Grid item>
                            <TicketSummary ticketNumber={this.props.id}
                                isManager={isManager}
                                userName={this.props.loggedUser.username}
                                photo={summaryPhoto}
                                department={this.props.department}
                                userFullName={this.props.user}
                                category={this.state.currentCategoryName}
                                detail={this.props.description}
                                status={this.state.currentStatus}
                                changeCategory={this.changeCategory}
                                changeTecnico = {this.changeTecnico}
                                editing={_canBeOn && isManager}
                                problem={this.props.problem}
                                categoryId={this.state.currentCategoryId} />
                        </Grid>
                        <Grid item>
                            <Paper style={{ padding: "10px" }}>
                                <PromiseDate promiseDate={this.props.promiseDate}
                                    changePromiseDate={this.changePromiseDate}
                                    isManager={isManager}
                                    id={this.props.id} />
                                {isManager ?
                                    <AssistanceType id={this.props.id}
                                        assistance={this.props.assistance}

                                        changeAssistance={this.changeAssistance}
                                        assistanceOptions={this.props.assistanceTypes} />
                                    : null
                                }
                            </Paper>

                        </Grid>
                        {this.state.fields.map(field => {
                            return <Grid key={field.name} item>
                                <TicketField  {...field} />
                            </Grid>;
                        })}
                    </Grid>
                    <Grid item md={8}  >
                        <Grid container style={{ marginBottom: "10px" }}>
                            <Grid item md={1}><Avatar src={photo} /></Grid>
                            <Grid item md={11}>
                                <Paper style={{ padding: "10px" }}>

                                    <div style={{ width: "98%", padding: '2px 4px 2px 9px', display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
                                        <TextField placeholder={"Comentarios..."}
                                            rows={3} fullWidth={true} multiline={true}
                                            value={this.state.comments}
                                            onChange={(event) => this.setState({ comments: event.target.value })}
                                        />
                                        <FabProgress submitDisabled={submitComment}
                                            handleSubmit={this.handleSubmit}
                                            status={this.state.currentStatus} />

                                    </div>

                                    {isManager ? <div style={{
                                        textAlign: "right",
                                        margin: "10px", display: "flex", justifyContent: "flex-end"
                                    }}>


                                        <ButtonProgress
                                            onClick={(finishCallBack) => this.handleSubmit(statusCodes.REJECTED.value, null, false, finishCallBack)}
                                            color={"secondary"} submitDisabled={submitDisabled}
                                            text={"Rechazar"}
                                            variant={"outlined"}
                                            icon={<FileCancel />} />

                                        <ButtonProgress
                                            onClick={(finishCallBack) => {
                                                this.finishCallBack = finishCallBack;
                                                this.setState({ isDialogOpen: true });

                                            }
                                            }
                                            color={"primary"} submitDisabled={submitDisabled}
                                            variant={"contained"}
                                            text={"Enviar con Tercero"}
                                            icon={<Send />} />

                                        <ButtonProgress
                                            onClick={(finishCallBack) => this.handleSubmit(statusCodes.SOLVED.value, null, true, finishCallBack)}
                                            submitDisabled={submitDisabled}
                                            color={"primary"}
                                            variant={"contained"}
                                            text={"Finalizar"}
                                            icon={<Check />} />

                                    </div> : null

                                    }
                                </Paper>

                            </Grid>
                        </Grid>

                        {postList}
                    </Grid>
                </Grid>
                <SnackBarMessage open={this.state.snackOpen} handleClose = {this.handleSnackBarClose} message = {this.state.message}/>
                <ThirdDialogForm isDialogOpen={this.state.isDialogOpen}
                    title={"Enviar con tercero"}
                    text={"Selecciona el tercero con el que procesaras la solicitud"}
                    handleDialogClose={this.handleDialogClose} thirds={this.state.thirds}

                />
            </React.Fragment>
        );

    }
}

const mapStateToProps = state => {

    return {
        loggedUser: state.user,
        assistanceTypes: state.assistanceTypes,

    }
}
export default connect(mapStateToProps)(TicketEditor)