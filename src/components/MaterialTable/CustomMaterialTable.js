import React from 'react';
import { Paper, Table, TableBody, TableFooter, TableRow, TablePagination, TableCell } from '@material-ui/core';
import { MaterialHeader } from './MaterialHeader';
import { MaterialRow } from './MaterialRow';
import { MaterialFooter } from './MaterialFooter';
import PropTypes from 'prop-types';

class CustomMaterialTable extends React.Component {
    state = {
        rowsPerPage: 10, page: 0, emptyRows: 0
    }

    handleChangePage = (event, page) => {

        let newState = { ...this.state };
        newState.page = page;
        this.setState(newState)
        if (this.props.changePageCallback) {
            this.props.changePageCallback(page);
        }

    };

    render() {
        const { columnas, list } = this.props;
        //Del objeto columna: sacamos el value para pasarlo a MaterialRow.
        const valores = columnas.map(item => item.value);
        const { page, rowsPerPage } = this.state;

        const filas = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(row => {
                return (
                    <MaterialRow columnas={valores} {...row} key={row.id}
                        rowClickHandle={() => {
                            if (this.props.rowClickHandle) {
                                this.props.rowClickHandle(row.id)
                            }
                        }}
                        tools={(this.props.toolbar ? <this.props.toolbar {...row} /> : null)}
                    />
                );
            });

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);
        return (
            <Paper style={{ padding: "10px", overflowX: "hidden" }}>
                <Table >
                    <MaterialHeader columns={columnas} />

                    <TableBody>
                        {filas}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 48 * this.state.emptyRows }} key="empty">
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={list.length}
                                rowsPerPage={rowsPerPage + 0}
                                labelRowsPerPage={this.props.labelRowsPerPage}
                                labelDisplayedRows={({ from, to, count }) => {
                                    return (from + '-' + to + ' de ' + count);
                                }}
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={MaterialFooter}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        )
    }
}

CustomMaterialTable.defaultProps = {
    preferences: {},
    labelRowsPerPage: "Rows per Page",
}
CustomMaterialTable.propTypes = {
    itemsList: PropTypes.array.isRequired,
    labelRowsPerPage: PropTypes.string.isRequired,
    defaultColumns: PropTypes.array,
    columnsArray: PropTypes.array.isRequired,
    savePreferenceToServer: PropTypes.func,
    toolbar: PropTypes.object,
    preferences: PropTypes.object,
}

export default CustomMaterialTable;