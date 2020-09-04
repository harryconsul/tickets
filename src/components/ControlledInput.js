import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class ControlledInput extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.children !== this.props.children
            || nextProps.error !== this.props.error;

    }
    state = { ref: React.createRef() };

    componentDidMount() {
        if (this.props.areYouFirst)
            this.state.ref.current.focus();
    }
    onChange = event => {
        if (this.props.type === "file") {
            const syntheticEvent = { target: { name: this.props.name, value: this.state.ref.current.files[0] } };


            this.props.onChange(syntheticEvent);
        } else {
            this.props.onChange(event)
        }


    }
    render() {
        const _inputProps = this.props.icon ? {
            startAdornment: (
                <InputAdornment position="start">
                    {this.props.icon}
                </InputAdornment>
            ), name: this.props.name,
            style: { minHeight: "36px" },
            inputRef: this.state.ref
        } : {
                name: this.props.name,
                style: { minHeight: "36px" },
                inputRef: this.state.ref,

            }

        return (
            <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                <Typography variant={"body1"}>{this.props.label} </Typography>
                <TextField id={this.props.id}
                    value={this.props.type === "file" ? undefined : this.props.value}
                    onChange={this.onChange}
                    InputProps={_inputProps}
                    style={this.props.style} type={this.props.type} required={this.props.required}
                    error={this.props.error} select={this.props.select} helperText={this.props.helperText}
                    InputLabelProps={{ children: this.props.label, shrink: true }} autoComplete={"off"}
                >
                    {this.props.children}
                </TextField>
            </Grid>
        )

    }

}
ControlledInput.defaultProps = {
    type: "text",
    style: {},
    required: false,
    error: false,
    select: false,
    helperText: "",
    defaultValue: "",
    icon: null,
    ref: null
}
ControlledInput.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.any,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.bool,
    select: PropTypes.bool,
    helperText: PropTypes.string,
    defaultValue: PropTypes.any,
    ref: PropTypes.any,

}

export default ControlledInput;
