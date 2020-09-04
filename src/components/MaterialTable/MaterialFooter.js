import React from 'react';
import { IconButton } from '@material-ui/core';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';

export const MaterialFooter = (props) => {

    const handleFirstPage = event => {
        props.onChangePage(event, 0);
    }

    const handlePreviousPage = event => {
        props.onChangePage(event, props.page - 1);
    }

    const handleNextPage = event => {
        props.onChangePage(event, props.page + 1);
    }

    const handleLastPage = event => {
        props.onChangePage(event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    }

    const { count, page, rowsPerPage } = props;
    const theme = { direction: 'ltr' };
    const divStyle = { minWidth: '300px' };

    return (
        <div style={divStyle}>
            {/*First Page */}
            <IconButton
                onClick={handleFirstPage}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            {/*Previous Page */}
            <IconButton
                onClick={handlePreviousPage}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            {/*Next Page */}
            <IconButton
                onClick={handleNextPage}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            {/*Last Page */}
            <IconButton
                onClick={handleLastPage}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}