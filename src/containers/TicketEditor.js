import React from 'react';
import TicketSummary from '../components/TicketSummary';
import ThirdDialogForm from '../components/ThirdDialogForm'
import PromiseDate from '../components/PromiseDate';
import AssistanceType from '../components/AssistanceType';
import Comment from '../components/Comment';
import TicketField from '../components/TicketField';
import StatusAvatar from '../components/StatusAvatar';
import { Button, Paper, Grid, TextField, IconButton, Avatar } from '@material-ui/core'
import SubmitCommentIcon from 'mdi-material-ui/ContentSaveEdit'
import FileCancel from 'mdi-material-ui/FileCancel';
import Send from 'mdi-material-ui/Send';
import Check from 'mdi-material-ui/Check';
import axios from 'axios';
import Graph from '../helpers/GraphSdkHelper';
import { connect } from 'react-redux';
import { statusCodes } from '../constants';
import { actionUpdateList } from '../actions/user.actions';
const buttonStyle = {
    marginLeft: "5px",
    marginRight: "5px",
}
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
            userPhoto: "",


        }
        this.promiseDate = props.promiseDate;
        this.assistance = props.assistance;
        this.finishDate=props.finishDate;
        this.helper = new Graph(this.props.loggedUser.accessToken);

    }

    handleSubmit = (_status, _comments) => {
        const { thirdPart } = this.state;
        const status = _status === statusCodes.NEW.value ?
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
            if(status === statusCodes.SOLVED.value
                 || status === statusCodes.REJECTED.value){
                    this.finishDate=response.data.post.date;
            }

            if (!_comments) {
                
                this.setState({
                    comments: "",
                    postList: [response.data.post, ...this.state.postList],
                    currentStatus: status,
                });
            } else {
                const engineer = this.props.user.username;
                //this.props.handleTicketUpdate({ id: this.props.id, status, engineer });
                this.props.dispatch(actionUpdateList(
                    {
                        id: this.props.id,
                        status, engineer,statusAvatar:<StatusAvatar status={status} />
                    }
                ));
            }
        }).catch(reason => {
            console.log(reason);
        });

    }
    handleDialogClose = (isOKClicked, third) => {
        this.setState({ isDialogOpen: false });
        if (isOKClicked) {
            this.setState({ thirdPart: third }, this.handleSubmit(statusCodes.THIRD.value));


        }

    }
    changeCategory = (category) => {
        axios.post("cambiarcategoria", {
            SolicitudId: this.props.id,
            CategoriaId: category,
            UsuarioLogin: this.props.loggedUser.username,

        }).then(response => {
            this.setState({ currentCategoryName: response.data.categoryName })
        })
    }
    changePromiseDate = (promiseDate) => {
        this.promiseDate = promiseDate;
    }
    changeAssistance = (assistance) => {
        this.assistance = assistance;
    }

    componentWillUnmount() {
        if (this.state.currentStatus === statusCodes.NEW.value) {

            this.handleSubmit(statusCodes.IN_PROCESS.value, "Asignación a ingeniero");

        } else {
            if (this.state.currentStatus !== this.props.status
                || this.props.promiseDate !== this.promiseDate
                || this.props.assistance !== this.assistance
                || this.props.finishDate !== this.finishDate
            ) {

                this.props.dispatch(actionUpdateList({
                    id: this.props.id,
                    status: this.state.currentStatus,
                    promiseDate: this.promiseDate,
                    finishDate:this.finishDate,
                    assistance:this.assistance,
                    engineer: this.props.engineer.trim() !== "" ? this.props.engineer : this.props.loggedUser.username,
                    statusAvatar:<StatusAvatar status={this.state.currentStatus} />,
                }));
            }
        }


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


            });
        });


        this.helper.getProfilePics([{ id: this.props.userID, photo: "" }], (photos) => {
            if (photos.length) {
                this.setState({ userPhoto: photos[0].photo });
            }
        });
    }
    render() {
        const postList = this.state.postList.map((post, index) => {
            return <Comment key={index} author={post.userFullName} date={post.date}
                comment={post.comments} photo={post.photo} />;
        });
        const _canBeOn = canBeOn(this.state.currentStatus);
        const submitDisabled = !(this.state.comments !== "" && _canBeOn)
        const photo = this.props.loggedUser ? this.props.loggedUser.photo : "";

        return (
            <React.Fragment>
                <Grid container style={{ marginTop: "10px" }} >
                    <Grid container direction={"column"} style={{ padding: "2%" }}
                        item md={4} spacing={8}>
                        <Grid item>
                            <TicketSummary ticketNumber={this.props.id}
                                isManager={true}
                                photo={this.state.userPhoto}
                                department={this.props.department}
                                userFullName={this.props.user}
                                category={this.state.currentCategoryName}
                                detail={this.props.description}
                                status={this.state.currentStatus}
                                changeCategory={this.changeCategory}
                                editing={_canBeOn}
                                problem={this.props.problem} />
                        </Grid>
                        <Grid item>
                            <Paper style={{padding:"10px"}}>
                                <PromiseDate promiseDate={this.props.promiseDate}
                                    changePromiseDate={this.changePromiseDate}
                                    id={this.props.id} />
                                <AssistanceType  id={this.props.id}
                                assistance={this.props.assistance}
                                changeAssistance={this.changeAssistance}
                                assistanceOptions={this.props.assistanceTypes} />
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
                                        <IconButton style={{ padding: "10" }}
                                            disabled={submitDisabled}
                                            onClick={() => this.handleSubmit(this.props.status)}>
                                            <SubmitCommentIcon />
                                        </IconButton>
                                    </div>

                                    <div style={{ textAlign: "right", margin: "10px" }}>
                                        <Button variant="outlined" style={buttonStyle}
                                            onClick={() => this.handleSubmit(statusCodes.REJECTED.value)}
                                            color={"secondary"} disabled={submitDisabled}>
                                            Rechazar <FileCancel />
                                        </Button>
                                        <Button variant="contained" style={buttonStyle}
                                            onClick={() => this.setState({ isDialogOpen: true })}
                                            color={"primary"} disabled={submitDisabled}>
                                            Enviar con Tercero <Send />
                                        </Button>
                                        <Button variant="contained" style={buttonStyle}
                                            onClick={() => this.handleSubmit(statusCodes.SOLVED.value)}
                                            color={"primary"} disabled={submitDisabled}>
                                            Finalizar <Check />
                                        </Button>

                                    </div>
                                </Paper>

                            </Grid>
                        </Grid>

                        {postList}
                    </Grid>
                </Grid>
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
        assistanceTypes : state.assistanceTypes,

    }
}
export default connect(mapStateToProps)(TicketEditor)