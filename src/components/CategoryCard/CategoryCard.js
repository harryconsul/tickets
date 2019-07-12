import React from 'react';
import Paper from '@material-ui/core/Paper';
import Application from 'mdi-material-ui/Application';
import Money from 'mdi-material-ui/CurrencyUsd';
import Wifi from 'mdi-material-ui/Wifi';
import Plug from 'mdi-material-ui/PowerPlug';
import Support from 'mdi-material-ui/FaceAgent';
import Inventory from 'mdi-material-ui/PackageVariant';
import Report from 'mdi-material-ui/FileChart';
import Database from 'mdi-material-ui/Database';
import { FileWord, FileExcel, ChartPie,AccountCheck,
     ClipboardAccount, AccountGroup } from 'mdi-material-ui';
import Phone from 'mdi-material-ui/Deskphone';
import Skype from 'mdi-material-ui/Skype';
import Web from 'mdi-material-ui/Web';
import Test from 'mdi-material-ui/TestTube';
import User from 'mdi-material-ui/AccountAlert';
import Comunication from 'mdi-material-ui/AccessPointNetwork';
import Billing from 'mdi-material-ui/CashUsd'
import Email from 'mdi-material-ui/Outlook'
import Printer from 'mdi-material-ui/Printer';
import Computer from 'mdi-material-ui/Laptop';
import CardText from 'mdi-material-ui/CardText';
import Microsoft from 'mdi-material-ui/Microsoft';
import CreditCard from 'mdi-material-ui/CreditCard';
import Sales from 'mdi-material-ui/Hand';
import Note from 'mdi-material-ui/NoteText';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles'
import { List, ListItem, ListItemText } from '@material-ui/core';
import "./CategoryCard.css";
import Tooltip from '@material-ui/core/Tooltip';


const CategoryCard = props => {
    const _iconStyle = { fontSize: '80', color: props.theme.palette.secondary.light };

    return (
        <Paper elevation={6} classes={{ root: "paper" }}
            style={{ padding: '10%', margin: '10px', textAlign: 'center' }} onClick={() => props.onClick(props.id)} >
            <Tooltip title={
                <React.Fragment>
                    <Typography style={{ color: "white" }} variant={"subtitle1"}>Este tipo de problema es atendido por:</Typography>
                    <List>
                        {props.engineers.map(engineer => <ListItem key={engineer}  >
                            <ListItemText primary={engineer} primaryTypographyProps={{ style: { color: "white" } }} />
                        </ListItem>)}

                    </List>
                </React.Fragment>
            }
                PopperProps={{
                    popperOptions: {
                        modifiers: {
                            arrow: {
                                enabled: true,

                            },
                        },
                    },
                }}
            >
                <div>

                    {iconSelection(props.label, props.type, _iconStyle)}
                    <Typography variant={props.type === 'main' ? "h5" : "h6"} color={"textSecondary"}>
                        {props.label}
                    </Typography>
                </div>



            </Tooltip>
        </Paper>
    );

}

const iconSelection = (semantic, type = 'main', style) => {
    const lower = semantic.toLowerCase();
    const _style = style;

    if (lower.indexOf("finanzas") >= 0 || lower.indexOf("cobrar") >= 0)
        return <Money style={_style} />;

    if (lower.indexOf("comunicación") >= 0)
        return <Comunication style={_style} />;

    if (lower.indexOf("reporte") >= 0)
        return <Report style={_style} />;

    if (lower.indexOf("logistica") >= 0)
        return <Inventory style={_style} />;

    if (lower.indexOf("ventas") >= 0)
        return <Sales style={_style} />;

    if (lower.indexOf("telefon") >= 0)
        return <Phone style={_style} />;

    if (lower.indexOf("skype") >= 0 || lower.indexOf("videoconferencias") >= 0)
        return <Skype style={_style} />;

    if (lower.indexOf("mantenimiento") >= 0 || lower.indexOf("call") >= 0)
        return <Support style={_style} />;

    if (lower.indexOf("pagar") >= 0)
        return <CreditCard style={_style} />;

    if (lower.indexOf("resultado") >= 0)
        return <Note style={_style} />;

    if (lower.indexOf("interfaz") >= 0)
        return <Plug style={_style} />;

    if (lower.indexOf("red") >= 0 || lower.indexOf("internet") >= 0)
        return <Wifi style={_style} />;

    if (lower.indexOf("web") >= 0)
        return <Web style={_style} />;

    if (lower.indexOf("laboratorio") >= 0)
        return <Test style={_style} />;

    if (lower.indexOf("usuario") >= 0)
        return <User style={_style} />;

    if (lower.indexOf("equipo") >= 0)
        return <Computer style={_style} />;

    if (lower.indexOf("impresora") >= 0)
        return <Printer style={_style} />;

    if (lower.indexOf("office") >= 0 || lower.indexOf("intranet") >= 0)
        return <Microsoft style={_style} />;

    if (lower.indexOf("correo") >= 0)
        return <Email style={_style} />;

    if (lower.indexOf("facturación") >= 0)
        return <Billing style={_style} />;

    if (lower.indexOf("comodato") >= 0)
        return <CardText style={_style} />;

    if (lower.indexOf("conexiones") >= 0)
        return <Database style={_style} />;

    if (lower.indexOf("word") >= 0)
        return <FileWord style={_style} />;

    if (lower.indexOf("excel") >= 0)
        return <FileExcel style={_style} />;

    if (lower==="oracle fusion")
        return <ClipboardAccount style={_style} />;

    if (lower==="taleo")
        return <AccountCheck style={_style} />;

    if (lower=== "hcm") 
        return <AccountGroup style={_style} />;


    if (lower === "bi")
        return <ChartPie style={_style} />;


    return <Application style={_style} />



}
export default withTheme()(CategoryCard);
