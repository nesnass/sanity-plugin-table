//eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';

const Table = ({ rows, selectCell, selectedRowIndex, selectedCellIndex }) => {
  if (!rows || !rows.length) return null;

  const renderRowCell = rowIndex => (cell, cellIndex) => {
    const CellType = `t${cell.header == 'on' ? 'h' : 'd'}`;
    return (
      <CellType
        key={`cell-${cellIndex}`}
        colSpan={cell.colspan}
        rowSpan={cell.rowspan}
        className={`${styles.cell} ${
          selectedRowIndex === rowIndex && selectedCellIndex === cellIndex
            ? styles.selectedCell
            : ''
        }`}
        style={{ backgroundColor: cell.color }}
        onClick={() => selectCell(rowIndex, cellIndex)}
      >
        <input
          className={styles.inputDisplay}
          type="text"
          readOnly
          style={{
            textAlign: cell.header == 'on' ? 'center' : 'left',
            paddingLeft: cell.header == 'on' ? '0' : '10px',
            color: cell.color != '#ffffff' ? 'white' : 'black',
          }}
          placeholder={`r${rowIndex}:c${cellIndex} data?`}
          value={cell.data}
        />
      </CellType>
    );
  };

  const renderRow = (row, rowIndex) => {
    const renderCell = renderRowCell(rowIndex);
    return <tr key={`row-${rowIndex}`}>{row.cells.map(renderCell)}</tr>;
  };

  return (
    <table className={styles.table}>
      <tbody>{rows.map(renderRow)}</tbody>
    </table>
  );
};

Table.propTypes = {
  rows: PropTypes.array,
  selectedRowIndex: PropTypes.number,
  selectedCellIndex: PropTypes.number,
  selectCell: PropTypes.func,
};

export default Table;
