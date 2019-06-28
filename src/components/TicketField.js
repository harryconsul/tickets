import React from 'react';
import {Link,Typography,Paper} from '@material-ui/core';

class TicketField extends React.Component{

    shouldComponentUpdate(){
        return false;
    }
    render(){
        return(
            <Paper >
                <Typography />
                {
                    ["image,file"].indexOf(this.props.type)>=0?
                    <Link href={this.props.value} >Haz clic para ver adjunto</Link>
                    :
                }
            </Paper>
        )
    }
}