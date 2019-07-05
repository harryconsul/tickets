import React from 'react';
import TicketSummary from '../components/TicketSummary';
import ThirdDialogForm from '../components/ThirdDialogForm'
import Comment from '../components/Comment';
import TicketField from '../components/TicketField';
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
const canBeOn=status=>{
    if(status!==statusCodes.SOLVED.value
        && status!==statusCodes.REJECTED.value){
            return true;
    }
    return false;

}


 class TicketEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            comments: "",
            thirdPart: 0,
            postList: [],
            fields: [],
            isDialogOpen:false,
            thirds:[],
            currentStatus:props.status,
            currentCategoryName:props.categoryName,            
            
        }

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
           
            
            if(!_comments){
                console.log("post",response.data.post);
                this.setState({comments:"",
                 postList:[response.data.post,...this.state.postList],
                currentStatus:status,
                });
            }else{
                const engineer = _comments?this.props.user.username:null;
                this.props.handleTicketUpdate({id:this.props.id,status,engineer});
            }
        }).catch(reason => {
            console.log(reason);
        });

    }
    handleDialogClose=(isOKClicked,third)=>{
        this.setState({isDialogOpen:false});
        if(isOKClicked){
            this.setState({thirdPart:third},this.handleSubmit(statusCodes.THIRD.value));

            
        }

    }
    changeCategory=(category)=>{
        axios.post("cambiarcategoria",{
            SolicitudId:this.props.id,
            CategoriaId:category,
            UsuarioLogin:this.props.user.username,

        }).then(response=>{
                this.setState({currentCategoryName:response.data.categoryName})
        })
    }
    
    componentWillUnmount(){
        if(this.state.currentStatus===statusCodes.NEW.value){
            
            this.handleSubmit(statusCodes.IN_PROCESS.value,"Asignación a ingeniero");

        }else{
            if(this.state.currentStatus!==this.props.status){
                this.props.handleTicketUpdate({id:this.props.id,status:this.state.currentStatus
                    });
            }
        }
        

    }
    componentDidMount() {
       //this.setState({currentStatus:this.props.status})
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
        const _canBeOn = canBeOn(this.state.currentStatus);
        const submitDisabled = !(this.state.comments!=="" && _canBeOn)
        const photo = this.props.user ? this.props.user.photo : "";

        return (
            <React.Fragment>
            <Grid container style={{ marginTop: "10px" }} >
                <Grid container direction={"column"} style={{padding:"2%"}}
                    item md={4} spacing={16} >
                    <Grid item>
                    <TicketSummary ticketNumber={this.props.id} 
                    category={this.state.currentCategoryName}
                        detail={this.props.description}
                        status={this.state.currentStatus}
                        changeCategory={this.changeCategory}
                        editing = {_canBeOn}
                        problem={this.props.problem} />
                    </Grid>

                    {this.state.fields.map(field=>{
                    return <Grid key={field.name} item>
                    <TicketField  {...field} />
                    </Grid>;
                    })}
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
                title = {"Enviar con tercero"}
                text={"Selecciona el tercero con el que procesaras la solicitud"}
                handleDialogClose={this.handleDialogClose} thirds={this.state.thirds}
                
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