import React from 'react';
import TicketSummary from '../components/TicketSummary';
import ThirdDialogForm from '../components/ThirdDialogForm'
import Comment from '../components/Comment';
import { Button, Paper, Grid, TextField, IconButton, Avatar } from '@material-ui/core'
import SubmitCommentIcon from 'mdi-material-ui/ContentSaveEdit'
import FileCancel from 'mdi-material-ui/FileCancel';
import Send from 'mdi-material-ui/Send';
import Check from 'mdi-material-ui/Check';
import axios from 'axios';
import {connect} from 'react-redux';
import {statusCodes} from '../constants';
const buttonStyle = {
    marginLeft: "5px",
    marginRight: "5px",
}
 class TicketEditor extends React.Component {
    state = {
        comments: "",
        thirdPart: 0,
        postList: [],
        fields: [],
        isDialogOpen:false,
        thirds:[],
        currentStatus:null,
    }
    handleSubmit = (_status,_comments) => {
        const {  thirdPart } = this.state;
        const status = _status===statusCodes.NEW.value?
            statusCodes.IN_PROCESS.value:
            _status
        const comments=_comments?_comments:this.state.comments;

        const data = {
            status,
            comments,
            thirdPart,
            id: this.props.id,
            user: this.props.user.username,
        }
        axios.post("grabarseguimiento", data).then(response => {
            const engineer = _comments?this.props.user.username:null;
            this.props.handleTicketUpdate({id:this.props.id,status,engineer});
            if(!engineer){
                this.setState({comments:"",
                 postList:[response.data.post,...this.state.postList],
                currentStatus:status,
                });
            }
        }).catch(reason => {
            console.log(reason);
        });

    }
    handleDialogClose=(isOKClicked)=>{
        this.setState({isDialogOpen:false});
        if(isOKClicked){
            this.handleSubmit(statusCodes.THIRD.value);
        }

    }
    handleThirdSuggest=(selectedItem,isOnTheList)=>{
        if(isOnTheList){
            const _third = this.state.thirds.find(item=>item.nombre===selectedItem);
            if(_third){
                this.setState({thirdPart:_third.value});
            }
        }else{
            if(this.state.thirdPart){
                this.setState({thirdPart:0});
            }
        }
    }
    componentWillUnmount(){
        if(this.props.status===statusCodes.NEW.value){
            
            this.handleSubmit(statusCodes.IN_PROCESS.value,"Asignación a ingeniero");

        }
    }
    componentDidMount() {
       this.setState({currentStatus:this.props.status})
        axios.post("obtienedetallesolicitud", { id: this.props.id }).then(response => {
            
            this.setState({
                fields: response.data.fields
                , postList: response.data.posts
                ,thirds:response.data.thirds.map(item=>({nombre:item.name,value:item.id}))
                ,
            });

        });
    }
    render() {
        const postList = this.state.postList.map((post,index) => {
            return <Comment key ={index} author={post.userFullName} date={post.date} comment={post.comments} />;
        });
        const submitDisabled = this.state.comments==="";
        const photo = this.props.user ? this.props.user.photo : "";

        return (
            <React.Fragment>
            <Grid container style={{ marginTop: "10px" }} >
                <Grid item md={4} >
                    <TicketSummary ticketNumber={this.props.id} category={this.props.category}
                        detail={this.props.description}
                        status={this.state.currentStatus}
                         problem={this.props.problem} />
                </Grid>
                <Grid item md={8}  >
                    <Grid container style={{marginBottom:"10px"}}>
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
                                    <Button variant="contained" style={buttonStyle}
                                        onClick={() => this.handleSubmit(statusCodes.REJECTED.value)}
                                        color={"secondary"} disabled={submitDisabled}>
                                        Rechazar <FileCancel />
                                    </Button>
                                    <Button variant="contained" style={buttonStyle}
                                        onClick={() => this.setState({isDialogOpen:true})}
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
                handleDialogClose={this.handleDialogClose} thirds={this.state.thirds}
                handleThirdSuggest={this.handleThirdSuggest} thirdPart={this.state.thirdPart}
            />
            </React.Fragment>
        );

    }
}

const mapStateToProps = state => {
    
    return {
        user: state.user,
       
    }
}
export default connect(mapStateToProps)(TicketEditor)