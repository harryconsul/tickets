import React from 'react';
import { Paper, Button, CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import Graph from '../helpers/GraphSdkHelper'
import axios from 'axios';
class MapOrganization extends React.Component {
    constructor(props) {
        super(props)

        this.helper = new Graph(props.user.accessToken);
        this.state = {
            personas: new Map(),
            isLoading: false,

        }
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        this.helper.getAllPeople("", (error, result) => {
            const personas = result.reduce((previous, item) => {

                if (item.jobTitle) {

                    previous.set(item.id, { ...item });
                }
                return previous;
            }
                , new Map());
            this.setState({ personas, isLoading: false });
        });
    }
    uploadUsers = () => {
        const promises = []
        this.setState({ isLoading: true });
        for (let [me] of this.state.personas) {
            if (me.inferredDepartment && me.mail) {
                const user = {
                    id: me.id,
                    department: me.inferredDepartment,
                    email: me.mail,
                    username: me.mail.replace("@dicipa.com.mx", ""),
                    name: me.displayName,



                }
                const promise = new Promise((resolve, reject) => {
                    axios.post("registrausuario", { user })
                        .then(response => {
                            resolve(user);
                        })
                        .catch(error => {
                            resolve(error);
                        });
                });
                promises.push(promise);
            }
            Promise.all(promises).then((result) => {
                this.setState({ isLoading: false });
            }).catch(() => {
                this.setState({ isLoading: false });
            })
        }

    }


    getManagers = () => {
        this.setState({ isLoading: true });
        const personas = new Map();
        const promises = []
        for (let [key, value] of this.state.personas) {
            promises.push(new Promise((resolve, reject) => this.helper.getUserManager(key, (result) => {
                value.manager = result;
                personas.set(key, value);
                resolve()
            })));

        }
        Promise.all(promises).then(() => this.setState({ personas, isLoading: false }));


    }
    analyzeCompany = () => {
        this.setState({ isLoading: true });
        const personas = new Map();
        for (let [key, current] of this.state.personas) {
            if (!current.inferredDepartment) {
                if (current.jobTitle.indexOf("Gerente") >= 0 || current.jobTitle.indexOf("Director") >= 0) {
                    current.inferredDepartment = current.department;
                } else {
                    if (current.manager) {
                        if (current.manager.jobTitle) {
                            if (current.manager.jobTitle.indexOf("Gerente") >= 0 || current.manager.jobTitle.indexOf("Director") >= 0) {
                                current.inferredDepartment = current.manager.department;
                            } else {
                                const manager = this.state.personas.get(current.manager.id);
                                if (manager) {
                                    if (manager.inferredDepartment) {
                                        current.inferredDepartment = manager.inferredDepartment;
                                    }
                                }
                            }
                        }
                        else {
                            const manager = this.state.personas.get(current.manager.id);
                            if (manager) {
                                if (manager.inferredDepartment) {
                                    current.inferredDepartment = manager.inferredDepartment;
                                }
                            }
                        }
                    }
                }
            }
            personas.set(key, current);

        }

        this.setState({ personas, isLoading: false });

    }
    render() {
        const personas = [];

        for (let persona of this.state.personas.values()) {

            personas.push(persona);
        }


        return (
            <Paper>
                <div><Button onClick={this.getManagers}>
                    Buscar Personas
                </Button>
                    <Button onClick={this.analyzeCompany}>
                        Analizar Empresa
                </Button>
                    <Button onClick={this.uploadUsers}>
                        Subir Usuarios
                </Button>
                </div>
                {this.state.isLoading ? <CircularProgress /> : null}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {personas.map(persona => <div>
                        {persona.displayName + " - " + persona.jobTitle}
                        <b>{persona.manager ? persona.manager.displayName + '-' + persona.manager.jobTitle : null}</b>
                        <i>{" > " + persona.inferredDepartment}</i>
                    </div>)}
                </div>
            </Paper>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.user,
    }
}
export default connect(mapStateToProps)(MapOrganization)