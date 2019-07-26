import React from 'react';
import { Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent, Button } from '@material-ui/core';
import Suggest from './Suggest';
const ThirdDialogForm = props => {
    const [third,setThird] = React.useState(0);
    const handleThirdSuggest=(selectedItem,isOnTheList)=>{
        if(isOnTheList){
            const _third =props.thirds.find(item=>item.nombre===selectedItem);
            if(_third){
                setThird(_third.value);
            }
        }else{
            if(third){
                setThird(0);
            }
        }
    }
    return (
        <Dialog open={props.isDialogOpen} >
            <DialogTitle >
                {props.title}
                </DialogTitle>
            <DialogContent style={{minHeight:"150px"}}>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
                <Suggest isMultiple={false} listaMedicos={props.thirds} 
                    handleSuggest={handleThirdSuggest}
                />
            </DialogContent>
            <DialogActions>
                <Button color={"secondary"}
                    onClick={() => props.handleDialogClose(false)}
                    variant={"contained"}>
                    Cancelar
                    </Button>
                <Button color={"primary"}
                    onClick={() => props.handleDialogClose(true,third)}
                    disabled={!third}
                    variant={"contained"}>
                    Aceptar 
                    </Button>
            </DialogActions>
        </Dialog>

    )

}
export default ThirdDialogForm;