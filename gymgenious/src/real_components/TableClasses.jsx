import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import WarningConnectionAlert from '../real_components/WarningConnectionAlert.jsx';
import ErrorTokenAlert from '../real_components/ErrorTokenAlert.jsx';
import SuccessAlert from '../real_components/SuccessAlert.jsx';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';

function EnhancedTable({ newRows, user, userType, handleSelectEvent }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isSmallScreen400 = useMediaQuery('(max-width:360px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    if(isSmallScreen400 || isSmallScreen500) {
      setRowsPerPage(10);
    } else {
      setRowsPerPage(5)
    }
    if(isMobileScreen) {
      setMaxHeight('700px');
    } else {
      setMaxHeight('600px')
    }
  }, [isSmallScreen400, isSmallScreen500, isMobileScreen])

  const visibleRows = React.useMemo(
    () =>
      [...newRows]
        .sort((a, b) =>
          order === 'asc'
            ? a[orderBy] < b[orderBy]
              ? -1
              : 1
            : a[orderBy] > b[orderBy]
            ? -1
            : 1
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, newRows]
  );

  return (
    <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#F5F5F5', border: '2px solid #424242', borderRadius: '10px' }}>
      <Paper
        sx={{
          width: '100%',
          backgroundColor: '#F5F5F5',
          borderRadius: '10px'
        }}
      >
        <TableContainer sx={{maxHeight: {maxHeight}, overflow: 'auto'}}>
          <Table
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <TableHead>
              <TableRow sx={{ height: '5vh', width: '5vh' }}>
                <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold',color: '#424242' }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'name')}
                  >
                    Name
                    {orderBy === 'name' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                {!isSmallScreen500 && (
                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                    <TableSortLabel
                      active={orderBy === 'hour'}
                      direction={orderBy === 'hour' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'hour')}
                    >
                      Start time
                      {orderBy === 'hour' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                )}
                {!isSmallScreen400 && (
                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                    <TableSortLabel
                      active={orderBy === 'start'}
                      direction={orderBy === 'start' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'start')}
                    >
                      Date
                      {orderBy === 'start' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                )}
                {!isSmallScreen600 && (
                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                    <TableSortLabel
                      active={orderBy === 'permanent'}
                      direction={orderBy === 'permanent' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'permanent')}
                    >
                      Recurrent
                      {orderBy === 'permanent' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length===0 ? (
                <TableRow>
                <TableCell colSpan={isSmallScreen500 ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                    There are no classes
                </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((row) => {
                    const conditions = (
                      (row.permanent === 'No' &&
                        (new Date(row.dateInicio).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                        (new Date(row.dateInicio).getTime() >= new Date().setHours(0, 0, 0, 0))
                        )
                        ||
                      (row.permanent === 'Si' && 
                        (new Date(row.start).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                        (new Date(row.start).getTime() >= new Date().setHours(0, 0, 0, 0))
                      )
                    )
                    const isTransparent = user && userType === 'client' && conditions;
                    return (
                      <TableRow
                        onClick={() => handleSelectEvent(row)}
                        hover
                        tabIndex={-1}
                        key={row.id}
                        sx={{
                          cursor: 'pointer',
                          borderBottom: '1px solid #424242',
                          opacity: !isTransparent ? 0.5 : 1,
                        }}
                      >
                        <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                          {row.name}
                        </TableCell>
                        {!isSmallScreen500 && (
                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{row.hour}</TableCell>
                        )}
                        {!isSmallScreen400 && (
                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{formatDate(new Date(row.start))}</TableCell>
                        )}
                        {!isSmallScreen600 && (
                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242', color: '#424242' }}>{row.permanent === 'Si' ? 'Yes' : 'No'}</TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {visibleRows.length!=0 ? (
          <>
            {isSmallScreen500 ? (
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={newRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                sx={{color:'#424242'}}
                onPageChange={handleChangePage}
              />
            ) : (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={newRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                sx={{color:'#424242'}}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        ) : (
          null
        )}
      </Paper>
    </Box>
  );
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default EnhancedTable;
