import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import uniqueString from 'unique-string';

const DDTable = ({ columns, rows, size, handleRowClick, style }) => {
  return (
    <TableContainer
      sx={style || {
        background: 'transparent',
        WebkitBoxShadow: '-3px -1px 10px 2px rgba(0,0,0,0.2)',
        boxShadow: '-3px -1px 10px 2px rgba(0,0,0,0.2)'
      }}
      component={Paper}
    >
      <Table sx={{ width: '100%' }} size={size || 'medium'}>
        <TableHead>
          <TableRow>
            {
              columns.map(c =>
                <TableCell key={uniqueString()} align='left'>{c.label}</TableCell>
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow
                key={uniqueString()}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  ':hover': {
                    cursor: handleRowClick ? 'pointer' : 'cursor'
                  }
                }}
                hover={!!handleRowClick}
                onClick={handleRowClick ? () => handleRowClick(row.orderId) : null}
              >
                {
                  columns.map(column =>
                    <TableCell key={uniqueString()} align='left'>{row[column.name]}</TableCell>
                  )
                }
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DDTable.defaultProps = {
  maxRows: 25
};

DDTable.propTypes = {
  rows: PropTypes.array.isRequired,
  maxRows: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  size: PropTypes.string,
  handleRowClick: PropTypes.func,
  style: PropTypes.object
};

export default DDTable;
