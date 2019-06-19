import React from 'react';
import { Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent, Button } from '@material-ui/core';
import Suggest from './Suggest';
const ThirdDialogForm = props => {

    return (
        <Dialog open={props.isDialogOpen} >
            <DialogTitle >
                Enviar con tercero
                </DialogTitle>
            <DialogContent style={{minHeight:"150px"}}>
                <DialogContentText>
                    Selecciona el tercero con el que procesaras la solicitud
                </DialogContentText>
                <Suggest isMultiple={false} listaMedicos={props.thirds} 
                    handleSuggest={props.handleThirdSuggest}
                />
            </DialogContent>
            <DialogActions>
                <Button color={"secondary"}
                    onClick={() => props.handleDialogClose(false)}
                    variant={"contained"}>
                    Cancelar
                    </Button>
                <Button color={"primary"}
                    onClick={() => props.handleDialogClose(true)}
                    disabled={!props.thirdPart}
                    variant={"contained"}>
                    Enviar 
                    </Button>
            </DialogActions>
        </Dialog>

    )

}
export default ThirdDialogForm;