import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const styleRow = { fontWeight: "560" };

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 13,
        padding: 5,
    },
}))(TableCell);

export const MaterialRow = props => {
    const { columnas } = props;

    return (
        <TableRow key={props.id} hover={true}>
            {
                columnas.map(item =>
                    <StyledTableCell
                        key={item}
                        align="left"
                        style={item === "id" ? styleRow : null}
                        onClick={props.rowClickHandle}>
                        {props[item]}
                    </StyledTableCell>
                )
            }
        </TableRow>
    );
}