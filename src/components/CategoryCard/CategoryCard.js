import React from 'react';
import Paper from '@material-ui/core/Paper';
import Money from 'mdi-material-ui/CurrencyUsd';
import Wifi from 'mdi-material-ui/Wifi';
import Plug from 'mdi-material-ui/PowerPlug';
import Support from 'mdi-material-ui/FaceAgent';
import Inventory from 'mdi-material-ui/PackageVariant';
import Report from 'mdi-material-ui/FileChart';
import Database from 'mdi-material-ui/Database';
import {
    FileWord, FileExcel, ChartPie, AccountCheck,
    ClipboardAccount, AccountGroup
} from 'mdi-material-ui';
import Phone from 'mdi-material-ui/Deskphone';
import Skype from 'mdi-material-ui/Skype';
import Web from 'mdi-material-ui/Web';
import Test from 'mdi-material-ui/TestTube';
import User from 'mdi-material-ui/AccountAlert';
import Comunication from 'mdi-material-ui/AccessPointNetwork';
import Billing from 'mdi-material-ui/CashUsd'
import Email from 'mdi-material-ui/MicrosoftOutlook';
import Printer from 'mdi-material-ui/Printer';
import Computer from 'mdi-material-ui/Laptop';
import CardText from 'mdi-material-ui/CardText';
import Microsoft from 'mdi-material-ui/Microsoft';
import CreditCard from 'mdi-material-ui/CreditCard';
import Sales from 'mdi-material-ui/Hand';
import Note from 'mdi-material-ui/NoteText';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles'
import "./CategoryCard.css";
//Sin uso: import Tooltip from '@material-ui/core/Tooltip';


const CategoryCard = props => {
    const _iconStyle = { fontSize: '50', color: props.theme.palette.secondary.light };

    return (
        <Paper elevation={6} classes={{ root: "paper" }}
            style={{ padding: '10%', margin: '10px', textAlign: 'center' }} onClick={() => props.onClick(props.id)} >
            {/* Requerimiento: no incluir como tooltip el nombre de los técnicos.
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
            */}
            <div style={{height:"120px"}}>
                {setIcon(props.icon, props.type, _iconStyle)}
                <Typography variant={props.type === 'main' ? "h6" : "subtitle1"} color={"textSecondary"}>
                    {props.label}
                </Typography>
            </div>
        </Paper>
    );

}
const setIcon = (icon, type = 'main', style) => {
    switch (icon) {
        case 'Money':
            return <Money style={style} />;
        case 'Comunication':
            return <Comunication style={style} />;
        case 'Report':
            return <Report style={style} />;
        case 'Inventory':
            return <Inventory style={style} />;
        case 'Sales':
            return <Sales style={style} />;
        case 'Phone':
            return <Phone style={style} />;
        case 'Skype':
            return <Skype style={style} />;
        case 'Support':
            return <Support style={style} />;
        case 'CreditCard':
            return <CreditCard style={style} />;
        case 'Note':
            return <Note style={style} />;
        case 'Plug':
            return <Plug style={style} />;
        case 'Wifi':
            return <Wifi style={style} />;
        case 'Web':
            return <Web style={style} />;
        case 'Test':
            return <Test style={style} />;
        case 'User':
            return <User style={style} />;
        case 'Computer':
            return <Computer style={style} />;
        case 'Printer':
            return <Printer style={style} />;
        case 'Microsoft':
            return <Microsoft style={style} />;
        case 'Email':
            return <Email style={style} />;
        case 'Billing':
            return <Billing style={style} />;
        case 'CardText':
            return <CardText style={style} />;
        case 'Database':
            return <Database style={style} />;
        case 'FileWord':
            return <FileWord style={style} />;
        case 'FileExcel':
            return <FileExcel style={style} />;
        case 'ClipboardAccount':
            return <ClipboardAccount style={style} />;
        case 'AccountCheck':
            return <AccountCheck style={style} />;
        case 'AccountGroup':
            return <AccountGroup style={style} />;
        case 'ChartPie':
            return <ChartPie style={style} />;
        default:
            return <Web style={style} />;
    }
}

export default withTheme(CategoryCard);
