import React from 'react';
import { Button, Typography, Paper } from '@material-ui/core';
const getFileExtension = (value) => {
    if (value.lastIndexOf("application/pdf") >= 0) {
        return '.pdf'
    }
    if (value.lastIndexOf("wordprocessingml") >= 0) {
        return '.docx'
    }
    if (value.lastIndexOf("spreadsheetml") >= 0) {
        return '.xlsx'
    }
}

export default class TicketField extends React.Component {

    shouldComponentUpdate() {
        return false;
    }
    openImage = () => {
        const isImage = this.props.value.indexOf("data:image") >= 0;
        if (isImage) {
            const newTab = window.open();
            newTab.document.body.innerHTML = '<img src="' + this.props.value + '" />';
        } else {
            const link = document.createElement("a");
            link.href = this.props.value;
            link.download = "file" + getFileExtension(this.props.value);
            link.click();
        }


    }
    render() {


        return (
            <Paper >
                <Typography>{this.props.label}</Typography>
                {
                    ["image", "file"].indexOf(this.props.type) >= 0 ?
                        (
                            <Button onClick={this.openImage} >
                                Haz clic para ver adjunto
                        </Button>
                        )
                        :
                        <Typography variant={"body1"}>
                            {this.props.value}
                        </Typography>
                }
            </Paper>
        )
    }
}