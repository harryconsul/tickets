import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import EngineerAvatar from './EngineerAvatar';
import StatusAvatar from './StatusAvatar';
import ThirdDialogForm from './ThirdDialogForm';
import axios from 'axios';
const TicketSummary = props => {
    const styleLineSpace = { marginBottom: "10px" };

    const [categories, setCategories] = React.useState([]);
    const [tecnicos, setTecnicos] = React.useState([]);

    const [dialogCategoyOpen, setCategoryDialogOpen] = React.useState(false);
    const [dialogTecnicoOpen, setTecnicoDialogOpen] = React.useState(false);

    const handleCategoryDialogClose = (isOk, categoryId) => {
        setCategoryDialogOpen(false);
        if (isOk && categoryId) {
            props.changeCategory(categoryId);
        }
    }

    const handleTecnicoDialogClose = (isOk, tecnico) => {
        setTecnicoDialogOpen(false);
        if (isOk && tecnico) {
            props.changeTecnico(tecnico);
        }
    }

    const handleDialogCategoria = () => {
        setCategoryDialogOpen(true);
        if (!categories.length) {
            axios.post("obtienecategorias").then(response => {
                const categoriesList = response.data.Categorias
                    .reduce((list, category) => {
                        if (category.subcategories.length) {
                            list = [...list, ...category.subcategories];
                        } else {
                            list.push(category);
                        }
                        return list;
                    }, []);
                setCategories(categoriesList.map(item => ({ nombre: item.label, value: item.id })));
            });
        }
    }

    const handleDialogTecnico = () => {
        setTecnicoDialogOpen(true);
        if (!tecnicos.length) {
            const data = {
                UsuarioLogin: props.userName,
                CategoriaId: props.categoryId
            }
            console.log(data);
            //Devoler los técnicos, excepto el que esta pidiendo el cambio
            axios.post("obtienetecnicos", data)
                .then(response => {

                    const tecnicos = response.data.Tecnicos;
                    console.log(tecnicos);
                    setTecnicos(tecnicos.map(
                        item => ({
                            nombre: item.name,
                            value: item.username
                        })
                    ));
                });
        }
    }

    return (
        <div>
            <Paper style={{ padding: '20px' }}>
                <EngineerAvatar photo={props.photo}
                    userFullName={props.userFullName}
                    department={props.department}
                    isManager={props.isManager} />
                <Typography variant={"h6"} style={styleLineSpace} >
                    {props.isManager ? "Necesito tu ayuda!" : "Hola! , Recibimos tu reporte "}
                </Typography>
                <Typography variant={"h3"} style={styleLineSpace} color={"primary"} > {props.ticketNumber}   </Typography>
                <Typography variant={"h5"} style={styleLineSpace}> {props.category}   </Typography>
                <Typography variant={"subtitle1"} style={styleLineSpace}> {props.problem}   </Typography>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <StatusAvatar status={props.status} />
                    {props.editing ?
                        <Button color={"secondary"} onClick={handleDialogCategoria} variant={"outlined"} >
                            Cambiar Categoria
                        </Button>
                        : null

                    }
                    {props.editing ?
                        <Button color={"secondary"} onClick={handleDialogTecnico} variant={"outlined"} >
                            Reasignar
                        </Button>
                        :
                        null
                    }
                </div>

            </Paper>
            <ThirdDialogForm isDialogOpen={dialogCategoyOpen}
                title={"Cambiar de Categoría"}
                text={"Selecciona la categoría correcta de la solicitud"}
                handleDialogClose={handleCategoryDialogClose} thirds={categories}

            />

            <ThirdDialogForm isDialogOpen={dialogTecnicoOpen}
                title={"Reasignar Solicitud"}
                text={"Seleccionar quien atendera la solicitud"}
                handleDialogClose={handleTecnicoDialogClose} thirds={tecnicos}

            />
        </div>
    )
}

export default TicketSummary;

