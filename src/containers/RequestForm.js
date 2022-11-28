import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import ProblemTypeCloud from '../components/ProblemTypeCloud';
import ControlledInput from '../components/ControlledInput';
import Grid from '@material-ui/core/Grid';
import PencilIcon from 'mdi-material-ui/PencilBoxOutline';
import SaveIcon from 'mdi-material-ui/ContentSave';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PeoplePicker from '../components/PeoplePicker/PeoplePicker';
import { SocketContext } from '../context/SocketContext';

function loadCanvas(blobImg, canvasId) {
    if (blobImg) {
        let canvas = document.getElementById(canvasId);

        let canvasCtx = canvas.getContext("2d");
        let image = new Image();
        image.onload = function () {
            console.log('this of onload function ', this);
            canvas.width = this.width;
            canvas.height = this.height;

            canvasCtx.drawImage(this, 0, 0);

        }
        let URLObject = window.URL || window.webkitURL;
        image.src = URLObject.createObjectURL(blobImg);


    }
}
const defaultFields = [
    {
        id: "img",
        label: "Si requiere adjuntar imagen (Ctrl-V)",
        name: "Imagen",
        type: "image",
        value: "",
        values: [],
    },
    {
        id: "file",
        label: "Si requiere anexar un documento, de clic en seleccionar archivo",
        name: "Archivo",
        type: "file",
        value: "",
        values: [],
    },

]
const RequestForm = (props) => {

    const [state, setState] = useState({
        problem: "", problems: [], problemSet: [], detail: "",
        fields: [...defaultFields], persona: null, disabled: true
    });

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        const imageField = state.fields.find(item => item.type === "image");
        if (imageField)
            window.addEventListener("paste", (e) => {
                let clipboardItems = e.clipboardData.items;

                if (clipboardItems.length > 0) {
                    let blob = clipboardItems[0].getAsFile();
                    loadCanvas(blob, "imgCanvas");
                    //Set state
                    const fields = state.fields.map(oneField => {
                        return oneField.name !== imageField.name ? oneField : { ...imageField, value: blob };
                    });
                    setState({ ...state, fields });
                }

            }, false)

    }, [state.fields]);

    useEffect(() => {
        setDisabled();
    }, [state.problem , state.persona]);

    const onClickProblem = (id) => {
        let _problems = [...state.problemSet];
        const _problemIndex = _problems.findIndex(item => item.id === id);
        if (_problemIndex >= 0) {
            const _problem = _problems[_problemIndex];
            _problems.splice(_problemIndex, 1);

            setState({
                ...state,
                disabled: false, problem: _problem.label, problems: _problems, fields: _problem.fields
            });
        }
    }

    const onChange = (event) => {
        console.log(event.target.name, event.target.value);
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const onChangeField = (event) => {
        let newFields = [...state.fields];

        const indexOf = newFields.findIndex(item => item.name === event.target.name);
        let field = { ...newFields[indexOf] };
        field.value = event.target.value;
        newFields[indexOf] = field;
        setState({ ...state, fields: newFields });
    }
    const onClickSave = event => {
        props.onComplete({
            element: "problemDetail",
            object: {
                label: state.problem,
                user: state.persona,
                ...state
            }
        });

        socket.emit('nuevo-ticket');
    }

    const setPersona = (persona) => {
        //Hasta que haya almenos una persona.
        if (persona.length > 0) {
            setState({
                ...state,
                persona: {
                    id: persona[0].id,
                    department: persona[0].department,
                    email: persona[0].secondaryText,
                    username: persona[0].secondaryText.replace("@dicipa.com.mx", ""),
                    name: persona[0].primaryText
                }
            });
        }
    }

    //Habilitar o no el botón guardar. 
    const setDisabled = () => {
        let disabled = true
        if (props.isAdmin) {
            if (state.problem !== "" && Boolean(state.persona)) {
                disabled = false
            }

        } else {
            if (state.problem !== "") {
                disabled = false
            }
        }
        //setState
        setState({
            ...state,
            disabled
        })
    }

    /*
    componentDidMount() {
        axios.post("obtieneproblemas", { CategoriaId: this.props.categoryId }).then(response => {
            const problemSet = response.data.Problemas.map(problema => {
                const _problem = {
                    ...problema,
                    fields: problema.fields.map(field => ({ ...field, value: "" })),
                    value: null
                }
                return _problem;
            });
            this.setState({ problems: problemSet, problemSet: problemSet });
        })
    }
    */

    return (
        <Paper style={{ padding: '20px' }}>
            <Grid container space={16} >
                <Grid item xs={12} style={{ marginBottom: '10px' }}>
                    <ProblemTypeCloud problems={state.problems} onClick={onClickProblem} />
                </Grid>
                {
                    props.isAdmin &&
                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                        <PeoplePicker
                            autoFocus={props.isAdmin}
                            setPersona={setPersona} />
                    </Grid>
                }
                <Grid item xs={12} style={{ marginBottom: '50px' }}>
                    <ControlledInput id={"problem"} name={"problem"} value={state.problem}
                        areYouFirst={!props.isAdmin}
                        label={"Descripción del problema"} style={{ width: '90%' }} icon={<PencilIcon />}
                        onChange={onChange} variant={true} multiline={true} />
                </Grid>
                <Grid container direction="row" justify="flex-start" alignItems="baseline">
                    {
                        state.fields.map(field =>
                            <Grid item xs={6} key={field.id} style={{ marginBottom: '20px' }}>
                                {field.type === 'image' ?
                                    <div> <Typography variant={"body1"}>{field.label} </Typography> <canvas id='imgCanvas'
                                        style={{ minWidth: '100px', minHeight: '100px', border: "1px solid", maxWidth: '50%' }}
                                    />
                                    </div>
                                    :
                                    <Grid container item xs={12} justify="left">
                                        <ControlledInput id={field.name} name={field.name} value={field.value}
                                            label={field.label} style={{ width: '90%', marginBottom: '50px' }}
                                            icon={<PencilIcon />} onChange={onChangeField}
                                            select={field.values.length ? true : false} type={field.type}
                                        >
                                            {field.values ? field.values.map((item, index) =>
                                                <MenuItem key={index} value={item}>{item} </MenuItem>) : null}
                                        </ControlledInput>
                                        <Grid item xs={6} style={{ float: 'right' }}>
                                            <Button variant={'contained'} color={'primary'}
                                                disabled={state.disabled}
                                                onClick={onClickSave}>
                                                Registrar Reporte
                                                    <SaveIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        )

                    }
                </Grid>
            </Grid>
        </Paper>
    )

}

export default RequestForm;