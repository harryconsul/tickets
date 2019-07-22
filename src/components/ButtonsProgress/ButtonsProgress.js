import React from 'react';
import { Fab, CircularProgress, Button } from '@material-ui/core';
import SubmitCommentIcon from 'mdi-material-ui/ContentSaveEdit';
import { statusCodes } from '../../constants';
import './ButtonsProgress.css';
const buttonStyle = {
    marginLeft: "5px",
    marginRight: "5px",
}
export const FabProgress = (props) => {
    const [isLoading, setLoading] = React.useState(false);
    return (

        <div className="buttonProgressWrapper">
            <Fab style={{ backgroundColor: statusCodes.IN_PROCESS.color }}
                disabled={props.submitDisabled || isLoading}
                className="buttonProgress"
                onClick={() => {
                    setLoading(true);
                    props.handleSubmit(props.status,null,()=>setLoading(false));
                }}>
                <SubmitCommentIcon />
            </Fab>
            {isLoading ? <CircularProgress className="FabProgressClass" /> : null}
        </div>

    )

}

export const ButtonProgress = (props) => {
    const [isLoading, setLoading] = React.useState(false);
    return (
        <div className="buttonProgressWrapper">
            <Button style={buttonStyle}
                onClick={()=>{
                        setLoading(true);
                        props.onClick(()=>setLoading(false));
                        
                    }
                }
                variant={props.variant}
                className="buttonProgress"
                color={props.color} disabled={props.submitDisabled || isLoading}>
                {props.text} {props.icon}
            </Button>
            {isLoading ? <CircularProgress size={24} className="buttonProgressClass" /> : null}
        </div>

    )
}