import React from 'react';
import { TableHead, TableRow, TableCell } from '@material-ui/core';

export const MaterialHeader = (props) => {
    const { columns } = props;
    
    return (
        <TableHead>
            <TableRow key="header" >
                {
                    columns.map((column)=> {
                        return <TableCell key={column.value} align="left" style={{padding:"5px"}}>
                            {column.label}
                        </TableCell>
                    })
                }
            </TableRow>
        </TableHead>
    );
}