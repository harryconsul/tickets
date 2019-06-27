import React,{Component} from 'react';
import {Popover,Button,Paper,Grid,MenuItem} from '@material-ui/core';
import Settings from 'mdi-material-ui/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {connect} from 'react-redux';
import axios from 'axios';
import ControlledInput from './ControlledInput';

class BusquedaAvanzada extends Component{

    state = {
        departamentos: [],rangos:[],setAnchorEl: null,asunto:'',
        departamento:'',rango:'', check: false, atiende:'', solicitante:'',solicitud:''
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

    handleBusquedaAvanzada = () => {
        //departamento:'',rango:'', check: false, atiende:'', solicitante:'',solicitud:''
        if (this.props.user){
            const data = {
                UsuarioLogin: this.props.user.username,
                Asunto: this.state.asunto,
                SolicitudId: this.state.solicitud,
                Atiende: this.state.atiende,
                Solicitante: this.state.solicitante,
                Departamento: this.state.departamento,
                Rango: this.state.rango
            }
            
            axios.post("busquedaavanzada", data)
            .then( response => {
                console.log("Response solicitudes: " , response.data.Solicitudes);
                /*const ticketList =response.data.Solicitudes.map(ticket => {
                        return { ...ticket, statusAvatar: <StatusAvatar status={ticket.status} /> }

                    })
                   
               this.props.dispatch(actionSearch(ticketList));
                this.props.history.push("/admin");
                */
            }).catch(reason => {
                console.log(reason);
            })

        }
    }

    render(){
        const open = Boolean(this.state.setAnchorEl);
        const id = open ? 'simple-popover' : null;
        const style = { width: "90%",margin:"5px 0px 5px 0px" };
        const stylefull = {width: "90%"}

        return (
            <div>
              <Button aria-describedby={id} variant="contained" onClick={this.handleClick}>
                Filtro
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
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
                    <Paper style={{ padding: "15px", margin: "15px" }} >
                        <Grid container alignItems={"flex-start"}>
                            <Grid item xs={6}>
                                <ControlledInput id="fltAsunto" 
                                    label="Asunto"
                                    value={this.state.asunto}
                                    onChange={this.handleChange}
                                    name={"asunto"}
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
                                    onClick={this.handleBusquedaAvanzada} 
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
          );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(BusquedaAvanzada);