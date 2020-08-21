import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class SwitchCheck extends React.Component {
    state = {
        checkedA: this.props.status ? this.props.status:false,
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked },
            () =>{
                this.props.handleSwitch(this.state.checkedA);
            });
    };

    render() {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={this.state.checkedA}
                        onChange={this.handleChange('checkedA')}
                        value="checkedA"
                        color="primary"
                    />
                }
                label={this.props.labelName}
            />
        )
    }
}

export default SwitchCheck;