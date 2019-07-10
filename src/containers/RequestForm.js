import React from 'react';
import Paper from '@material-ui/core/Paper';
import ProblemTypeCloud from '../components/ProblemTypeCloud';
import ControlledInput from '../components/ControlledInput';
import Grid from '@material-ui/core/Grid';
import PencilIcon from 'mdi-material-ui/PencilBoxOutline';
import SaveIcon from 'mdi-material-ui/ContentSave';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import PeoplePicker from '../components/PeoplePicker/PeoplePicker';

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

class RequestForm extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        problem: "", problems: [], problemSet: [], detail: "", fields: [], persona:{}
    }
    onClickProblem = (id) => {
        let _problems = [...this.state.problemSet];
        const _problemIndex = _problems.findIndex(item => item.id === id);
        if (_problemIndex >= 0) {
            const _problem = _problems[_problemIndex];
            _problems.splice(_problemIndex, 1);

            this.setState({ problem: _problem.label, problems: _problems, fields: _problem.fields });
        }
    }
    onChange = event => {

        this.setState({ [event.target.name]: event.target.value });
    }
    onChangeField = event => {
        let newFields = [...this.state.fields];

        const indexOf = newFields.findIndex(item => item.name === event.target.name);
        let field = { ...newFields[indexOf] };
        field.value = event.target.value;
        newFields[indexOf] = field;
        //console.log("event field",event.target.files);
        this.setState({ fields: newFields });
    }
    onClickSave = event => {
        this.props.onComplete({ element: "problemDetail", object: { label: this.state.problem, ...this.state } })
    }

    setPersona = (personas) => {
        if(personas){
            this.setState({
                persona: personas
            });
        }
    }

    componentDidUpdate() {
        const imageField = this.state.fields.find(item => item.type === "image");
        if (imageField)
            window.addEventListener("paste", (e) => {
                let clipboardItems = e.clipboardData.items;

                if (clipboardItems.length > 0) {
                    let blob = clipboardItems[0].getAsFile();
                    loadCanvas(blob, "imgCanvas");
                    //Set state
                    const fields = this.state.fields.map(oneField => {
                        return oneField.name !== imageField.name ? oneField : { ...imageField, value: blob };
                    });
                    this.setState({ fields: fields });
                }

            }, false)
    }
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

    render() {
        return (
            <Paper style={{ padding: '20px' }}>
                <Grid container space={16} >
                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                        <ProblemTypeCloud problems={this.state.problems} onClick={this.onClickProblem} />
                    </Grid>
                    {
                        this.props.isAdmin ?
                            <Grid item xs={12} style={{ marginBottom: '20px' }}>
                                <PeoplePicker setPersona={this.setPersona} />
                            </Grid>
                            :
                            null
                    }
                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                        <ControlledInput id={"problem"} name={"problem"} value={this.state.problem}
                            areYouFirst={true}
                            label={"Descripción del problema"} style={{ width: '90%' }} icon={<PencilIcon />}
                            onChange={this.onChange} />
                    </Grid>
                    {
                    /*
                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                        <ControlledInput id={"detail"} name={"detail"} value={this.state.detail}
                            label={"Detalle de la Solicitud"} style={{ width: '90%' }} icon={<PencilIcon />}
                            onChange={this.onChange} />
                    </Grid>
                    */}

                    {
                        this.state.fields.map(field =>
                            <Grid item xs={12} key={field.id} style={{ marginBottom: '20px' }}>
                                {field.type === 'image' ?
                                    <div> <Typography variant={"body1"}>{field.label} </Typography> <canvas id='imgCanvas'
                                        style={{ minWidth: '100px', minHeight: '100px', border: "1px solid" }}
                                    />
                                    </div>
                                    :
                                    <ControlledInput id={field.name} name={field.name} value={field.value}
                                        label={field.label} style={{ width: '90%' }} icon={<PencilIcon />}
                                        onChange={this.onChangeField} select={field.values.length ? true : false} type={field.type}>
                                        {field.values ? field.values.map((item, index) =>
                                            <MenuItem key={index} value={item}>{item} </MenuItem>) : null}
                                    </ControlledInput>
                                }
                            </Grid>
                        )

                    }
                    <Grid item xs={12} alignItems={'flex-end'} container direction={'column'} >
                        <Grid item xs={3} style={{ float: 'right' }}>
                            <Button variant={'contained'} color={'primary'}
                                disabled={this.state.problem === ''}
                                onClick={this.onClickSave}>
                                Registrar Reporte
                                <SaveIcon />
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
            </Paper>
        )
    }

}

export default RequestForm;