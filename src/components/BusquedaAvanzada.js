import React,{Component} from 'react';
import {Popover,Button,Paper,Grid,MenuItem} from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Settings from 'mdi-material-ui/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {connect} from 'react-redux';
import axios from 'axios';
import ControlledInput from './ControlledInput';
import StatusAvatar from './StatusAvatar';
import {actionSearch} from '../actions/user.actions';
import {IconButton } from '@material-ui/core';
import DownIcon from 'mdi-material-ui/MenuDown';
import CloseIcon from 'mdi-material-ui/Close';

class BusquedaAvanzada extends Component{

    state = {
        departamentos: [],rangos:[],setAnchorEl: null,problema:'',
        check: false, atiende:'', solicitante:'',
        solicitud:0,departamento:0,rango:0
    }

    getDepartamentos = () =>{
        axios.post('obtienedepartamentos')
        .then(response => {
            this.setState({
                departamentos: response.data.Departamentos.map(departamento =>{
                    return (
                        <MenuItem key={departamento.Id} value={departamento.Id}>
                            {departamento.Nombre}
                        </MenuItem>
                    );
                })
            });
        })
        .catch(error => {
            console.log("Error al buscar departamentos",error);
        })
    }

    getRangos = () =>{
        axios.post('obtienerangos')
        .then(response => {
            this.setState({
                rangos: response.data.Rangos.map(rango =>{
                    return (
                        <MenuItem key={rango.Id} value={rango.Id}>
                            {rango.Descripcion}
                        </MenuItem>
                    );
                })
            });
        })
        .catch(error => {
            console.log("Error al buscar rangos",error);
        }) 
    }

    handleClick = (event) => {
        this.setState({
            setAnchorEl: event.currentTarget
        });
    }

    handleClose = () =>{
        this.setState({
            setAnchorEl: null
        });
    }
    
    componentDidMount(){
        if(this.state.departamentos.length === 0){
            this.getDepartamentos();
        }

        if(this.state.rangos.length === 0){
            this.getRangos();
        }
    }
    
    handleChange = event => {
        //console.log("VALUE ->" , event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    }

    handleResuelto = event => {
        const check = this.state.check
        this.setState({
            check: !check
        }, () => {
            //console.log("CHECK -> ", this.state.check);
        });
    }

    handleBusquedaAvanzada = (event,popupState) => {
        
        if (this.props.user){
            let solicitud = 0;
           if (this.state.solicitud > 0)
                solicitud = this.state.solicitud;

            const data = {
                UsuarioLogin: this.props.user.username,
                Problema: this.state.problema,
                Id: solicitud,
                Atiende: this.state.atiende,
                Solicitante: this.state.solicitante,
                Departamento: this.state.departamento,
                Rango: this.state.rango,
                Resuelto: this.state.check
            }
            
            axios.post("busquedaavanzada", data)
            .then( response => {
                const ticketList =response.data.Solicitudes.map(ticket => {
                    return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }

                })
                if(data.Problema.length !== 0 || data.Id > 0 || data.Atiende.length !==0 
                    || data.Solicitante.length !== 0 || data.Departamento.length !== 0 || data.Rango.length !== 0 || data.Resuelto){
                    //Devolvemos en true, porque ya hay datos en los filtros.
                    this.props.setClean(true);
                }

                //Close Popover
                popupState.close();
                
                this.props.dispatch(actionSearch(ticketList));
                this.props.history.push("/");
                
            }).catch(reason => {
                console.log(reason);
            });
        }
    }
    
    handlerClean = (event) =>{
        if(this.props.clean){
            this.setState({
                departamentos: [],rangos:[],setAnchorEl: null,problema:'',
                check: false, atiende:'', solicitante:'',
                solicitud:0,departamento:0,rango:0
            },() => {
                if (this.props.user){
                    let solicitud = 0;
                    if (this.state.solicitud > 0)
                        solicitud = this.state.solicitud;
        
                    const data = {
                        UsuarioLogin: this.props.user.username,
                        Problema: this.state.problema,
                        Id: solicitud,
                        Atiende: this.state.atiende,
                        Solicitante: this.state.solicitante,
                        Departamento: this.state.departamento,
                        Rango: this.state.rango,
                        Resuelto: this.state.check
                    }
                    
                    axios.post("busquedaavanzada", data)
                    .then( response => {
                        const ticketList =response.data.Solicitudes.map(ticket => {
                            return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }
        
                        })

                        this.props.dispatch(actionSearch(ticketList));
                        this.props.history.push("/");

                    })
                    .catch(reason => {
                        console.log(reason);
                    });
                }
            });

            this.props.setClean(false);
        }
        
    }

    render(){
        const style = { width: "90%",margin:"5px 0px 5px 0px" };
        const stylefull = {width: "90%"}
        
        return (
            <div>
            <PopupState variant="popover" popupId="demo-popup-popover">
                {popupState => (
                    <div>
                        {/*Icono X para limpiar filtros*/}
                        {this.props.clean?
                            <IconButton style={{ padding: "4px" }} onClick={this.handlerClean}>
                                <CloseIcon />
                            </IconButton>
                            :
                            <IconButton style={{ padding: "4px" }}>
                                
                            </IconButton>
                        }
                        
                        {/*Icono para mostrar menu de filtros*/}
                        <IconButton style={{ padding: "4px" }} variant="contained" {...bindTrigger(popupState)}>
                            <DownIcon />
                        </IconButton>
                    <Popover
                        PaperProps = {{style:{width:"70%"}}}
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                    >
                        <form>
                            <Paper style={{ padding: "15px", margin: "0px" }} >
                                <Grid container alignItems={"flex-start"}>
                                    <Grid item xs={6}>
                                        <ControlledInput id="fltProblema" 
                                            label="Problema"
                                            value={this.state.problema}
                                            onChange={this.handleChange}
                                            name={"problema"}
                                            style={stylefull}
                                            //error={this.state.expedienteHelper !== ""}
                                            //helperText={this.state.expedienteHelper}
                                            areYouFirst={true}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ControlledInput id="fltSolicitud" 
                                            label="No. de Solicitud"
                                            value={this.state.solicitud}
                                            onChange={this.handleChange}
                                            name={"solicitud"}
                                            style={style}
                                            type="number"
                                            //error={this.state.expedienteHelper !== ""}
                                            //helperText={this.state.expedienteHelper}
                                        />
                                    </Grid> 
                                    <Grid item xs={6}>
                                        <ControlledInput id="ftlSolicitante" 
                                            label="¿Quién generó la solicitud?"
                                            value={this.state.solicitante}
                                            onChange={this.handleChange}
                                            name={"solicitante"}
                                            style={style}
                                            //error={this.state.expedienteHelper !== ""}
                                            //helperText={this.state.expedienteHelper}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ControlledInput id="fltAtiende" 
                                            label="¿Quién atendió la solicitud?"
                                            value={this.state.atiende}
                                            onChange={this.handleChange}
                                            name={"atiende"}
                                            style={style}
                                            //error={this.state.expedienteHelper !== ""}
                                            //helperText={this.state.expedienteHelper}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ControlledInput id={"fltDepartamento"}
                                        value= {this.state.departamento}
                                        onChange={this.handleChange}
                                        name={"departamento"}
                                        label={"Departamento solicitante"}
                                        select
                                        style={style}>
                                        {this.state.departamentos}
                                    </ControlledInput>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ControlledInput id={"fltRango"}
                                            value= {this.state.rango}
                                            onChange={this.handleChange}
                                            name={"rango"}
                                            label={"Rango de fechas"}
                                            select
                                            style={style}>
                                            {this.state.rangos}
                                        </ControlledInput>
                                    </Grid> 
                                    <Grid item xs={6}>
                                        <FormControlLabel key={1} control={
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                checked={this.state.check}
                                                onChange={this.handleResuelto}
                                                //value={this.state.check}
                                            />
                                        }
                                            label={"Resuelto por el usuario"} 
                                        />
                                    </Grid>  
                                    <Grid item xs={9} />
                                    <Grid xs={3} item >
                                        <Button color={"primary"} 
                                            style={{ float: "right" }} 
                                            onClick={(event) => this.handleBusquedaAvanzada(event,popupState)} 
                                            variant="contained">
                                                Buscar
                                                <Settings />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </form>
                    </Popover>
                    </div>
                )}
                </PopupState>
          
            </div>
          );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(BusquedaAvanzada);