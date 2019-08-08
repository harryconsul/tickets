import React, { Component } from 'react';
import { Popover, Button, Paper, Grid, MenuItem } from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Settings from 'mdi-material-ui/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { connect } from 'react-redux';
import axios from 'axios';
import ControlledInput from './ControlledInput';
import StatusAvatar from './StatusAvatar';
import { actionSearch } from '../actions/user.actions';
import { IconButton } from '@material-ui/core';
import DownIcon from 'mdi-material-ui/MenuDown';
import CloseIcon from 'mdi-material-ui/Close';

class BusquedaAvanzada extends Component {

    state = {
        departamentos: [], categorias: [], rangos: [], problema: '',
        check: false, atiende: '', solicitante: '',
        solicitud: 0, departamento: 0, rango: 0, categoria: 0
    }

    getDepartamentos = () => {
        if (this.props.user) {

            const data = {
                UsuarioLogin: this.props.user.username,
                Tipo: 'DEPARTAMENTOS'
            }

            axios.post('obtienefiltros', data)
                .then(response => {
                    this.setState({
                        departamentos: response.data.Datos.map(departamento => {
                            return (
                                <MenuItem key={departamento.Id} value={departamento.Id}>
                                    {departamento.Nombre}
                                </MenuItem>
                            );
                        })
                    });
                })
                .catch(error => {
                    console.log("Error al buscar departamentos", error);
                })
        }
    }

    getCategorias = () => {
        if (this.props.user) {

            const data = {
                UsuarioLogin: this.props.user.username,
                Tipo: 'CATEGORIAS'
            }

            axios.post('obtienefiltros', data)
                .then(response => {
                    this.setState({
                        categorias: response.data.Datos.map(categoria => {
                            return (
                                <MenuItem key={categoria.Id} value={categoria.Id}>
                                    {categoria.Nombre}
                                </MenuItem>
                            );
                        })
                    });
                })
                .catch(error => {
                    console.log("Error al buscar categorías", error);
                })
        }
    }

    getRangos = () => {
        axios.post('obtienerangos')
            .then(response => {
                this.setState({
                    rangos: response.data.Rangos.map(rango => {
                        return (
                            <MenuItem key={rango.Id} value={rango.Id}>
                                {rango.Descripcion}
                            </MenuItem>
                        );
                    })
                });
            })
            .catch(error => {
                console.log("Error al buscar rangos", error);
            })
    }

    componentDidMount() {
        if (this.state.departamentos.length === 0) {
            this.getDepartamentos();
        }

        if (this.state.categorias.length === 0) {
            this.getCategorias();
        }

        if (this.state.rangos.length === 0) {
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

    handleBusquedaAvanzada = (event, popupState) => {

        if (this.props.user) {
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
                Categoria: this.state.categoria,
                Rango: this.state.rango,
                Resuelto: this.state.check
            }

            this.props.dispatch(actionSearch(data)).then(() => {

                if (data.Problema.length !== 0 || data.Id > 0 || data.Atiende.length !== 0
                    || data.Solicitante.length !== 0 || data.Departamento.length !== 0 || data.Rango.length !== 0 || data.Resuelto) {
                    //Devolvemos en true, porque ya hay datos en los filtros.
                    this.props.setClean(true);
                }

                //Pasar filtros al filtro principal
                const departamento = this.getNombre(data.Departamento, "departamentos");
                const rango = this.getNombre(data.Rango, "rangos");
                const categoria = this.getNombre(data.Categoria, "categorias");
                this.props.setInputClean(data, departamento, rango, categoria);
                popupState.close();
              
            });

        }
    }

    handlerClean = (event) => {
        if (this.props.clean) {
            this.setState({
                problema: '',
                check: false, atiende: '', solicitante: '',
                solicitud: 0, departamento: 0, rango: 0, categoria: 0
            }, () => {
                if (this.props.user) {
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
                        Categoria: this.state.categoria,
                        Rango: this.state.rango,
                        Resuelto: this.state.check
                    }

                    this.props.dispatch(actionSearch(data)).then(()=>{
                        this.props.setClean(false);
                        this.props.cleanSearch();
                    })
                }
            });

          
        }

    }

    getNombre = (id, cual) => {
        let arreglo = [];
        if (cual === "departamentos") {
            arreglo = this.state.departamentos;
        }
        if (cual === "rangos") {
            arreglo = this.state.rangos;
        }

        if (cual === "categorias") {
            arreglo = this.state.categorias;
        }

        let nombre = "";
        //Navegar hasta que hagan match los id's
        for (let i = 0; i < arreglo.length; i++) {
            if (arreglo[i].props.value === id && id !== 0) {
                nombre = arreglo[i].props.children;
            }
        }
        return nombre;
    }

    render() {
        const style = { width: "90%", margin: "5px 0px 5px 0px" };
        const stylefull = { width: "90%" }

        return (
            <div>
                <PopupState variant="popover" popupId="demo-popup-popover">
                    {popupState => (
                        <div>
                            {/*Icono X para limpiar filtros*/}
                            {this.props.clean ?
                                <IconButton style={{ padding: "4px" }} onClick={this.handlerClean}>
                                    <CloseIcon />
                                </IconButton>
                                :
                                null
                            }

                            {/*Icono para mostrar menu de filtros*/}
                            <IconButton style={{ padding: "4px" }} variant="contained" {...bindTrigger(popupState)}>
                                <DownIcon />
                            </IconButton>
                            <Popover
                                PaperProps={{ style: { width: "70%" } }}
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
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ControlledInput id="ftlSolicitante"
                                                    label="¿Quién generó la solicitud?"
                                                    value={this.state.solicitante}
                                                    onChange={this.handleChange}
                                                    name={"solicitante"}
                                                    style={style}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ControlledInput id="fltAtiende"
                                                    label="¿Quién atendió la solicitud?"
                                                    value={this.state.atiende}
                                                    onChange={this.handleChange}
                                                    name={"atiende"}
                                                    style={style}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ControlledInput id={"fltDepartamento"}
                                                    value={this.state.departamento}
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
                                                    value={this.state.rango}
                                                    onChange={this.handleChange}
                                                    name={"rango"}
                                                    label={"Rango de fechas"}
                                                    select
                                                    style={style}>
                                                    {this.state.rangos}
                                                </ControlledInput>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ControlledInput id={"fltCategoria"}
                                                    value={this.state.categoria}
                                                    onChange={this.handleChange}
                                                    name={"categoria"}
                                                    label={"Categoría solicitada"}
                                                    select
                                                    style={style}>
                                                    {this.state.categorias}
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
                                                    onClick={(event) => this.handleBusquedaAvanzada(event, popupState)}
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