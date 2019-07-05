import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import EngineerAvatar from './EngineerAvatar';
import StatusAvatar from './StatusAvatar';
import ThirdDialogForm from './ThirdDialogForm';
import axios from 'axios';
const TicketSummary = props => {
    const styleLineSpace = { marginBottom: "10px" };
   
    const [categories,setCategories] = React.useState([]);    
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClose = (isOk,categoryId) => {
        setDialogOpen(false);
        if(isOk && categoryId){
           props.changeCategory(categoryId);
        } 

    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
        if (!categories.length) {
            axios.post("obtienecategorias").then(response => {
                const categoriesList = response.data.Categorias
                                .reduce((list,category)=>{
                                    if(category.subcategories.length){
                                        list = [...list,...category.subcategories];
                                    }else{
                                        list.push(category);
                                    }
                                    return list;
                                },[]);
               
                setCategories(categoriesList.map(item=>({nombre:item.label,value:item.id})));
            });
        }
    }
   
    return (
        <div>
            <Paper style={{ padding: '20px' }}>
                <EngineerAvatar photo={props.photo} isManager={props.isManager}/>                
                <Typography variant={"h6"} style={styleLineSpace} > 
                    {props.isManager ? "Necesito tu ayuda!":"Hola! , Recibimos tu reporte " } 
                </Typography>
                <Typography variant={"h3"} style={styleLineSpace} color={"primary"} > {props.ticketNumber}   </Typography>
                <Typography variant={"h5"} style={styleLineSpace}> {props.category}   </Typography>
                <Typography variant={"subtitle1"} style={styleLineSpace}> {props.problem}   </Typography>
               
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <StatusAvatar status={props.status} />
                    {props.editing ?
                        <Button color={"secondary"} onClick={handleDialogOpen} variant={"outlined"} >
                            Cambiar Categoria
                         </Button>
                        : null

                    }
                </div>

            </Paper>
            <ThirdDialogForm isDialogOpen={dialogOpen}
                title={"Cambiar de Categoria"}
                text={"Selecciona la categoria correcta de la solicitud"}
                handleDialogClose={handleDialogClose} thirds={categories}
               
            />
        </div>
    )
}

export default TicketSummary;

