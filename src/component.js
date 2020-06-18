import uuid from '@sanity/uuid';
import React from 'react';
import PropTypes from 'prop-types';
import Table from './components/table';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';
import FieldSet from 'part:@sanity/components/fieldsets/default';
import FormField from 'part:@sanity/components/formfields/default';
import ButtonGroup from 'part:@sanity/components/buttons/button-group';
import Button from 'part:@sanity/components/buttons/default';
import TextInput from 'part:@sanity/components/textinputs/default';
// import { MdDelete, MdAdd } from 'react-icons/md';
import styles from './component.css';

/* const createPatchFrom = value => {
  return PatchEvent.from(set(value));
}; */
const createPatchFrom = value =>
  PatchEvent.from(value === '' ? unset() : set(value));

export default class TableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowIndex: 0,
      selectedCellIndex: 0,
    };
  }

  focusRef = React.createRef();
  cellInputRef = React.createRef();

  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      options: PropTypes.object,
    }).isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };

  focus() {
    if (this.focusRef.current && this.focusRef.current.focus) {
      this.focusRef.current.focus();
    }
  }

  updateHeading = event => {
    const { value, onChange } = this.props;
    const newValue = { ...value };
    newValue.heading = event.target.value;
    return onChange(createPatchFrom(newValue));
  };
  updateCell = (changedValue, rowIndex, cellIndex, attrib) => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    let cellValue =
      attrib == 'colspan' || attrib == 'rowspan'
        ? parseInt(changedValue)
        : changedValue;
    if (attrib == 'header') {
      cellValue =
        newValue.rows[rowIndex].cells[cellIndex][attrib] == 'on' ? 'off' : 'on';
    }
    newValue.rows[rowIndex].cells[cellIndex][attrib] = cellValue;
    return onChange(createPatchFrom(newValue));
  };

  removeCell = (rowIndex, cellIndex) => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    newValue.rows[rowIndex].cells.splice(cellIndex, 1);
    if (cellIndex === 0) {
      this.removeRow(rowIndex);
    }
    return onChange(createPatchFrom(newValue));
  };

  addCell = (rowIndex, cellIndex) => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    newValue.rows[rowIndex].cells.splice(cellIndex + 1, 0, {
      _type: 'cell',
      colspan: 1,
      rowspan: 1,
      data: '',
      color: '#ffffff',
      header: 'off',
    });
    this.selectCell(rowIndex, cellIndex + 1);
    return onChange(createPatchFrom(newValue));
  };

  initializeTable = () => {
    const { onChange } = this.props;
    // Add a single row with a single empty cell (1 row, 1 column)
    const newValue = {
      heading: '',
      rows: [
        {
          _key: uuid(),
          _type: 'tableRow',
          cells: [
            {
              _type: 'cell',
              colspan: 1,
              rowspan: 1,
              data: '',
              color: '#ffffff',
              header: 'off',
            },
          ],
        },
      ],
      _key: uuid(),
      _type: 'adaptable',
    };
    return onChange(createPatchFrom(newValue));
  };

  addRow = rowIndex => {
    const { value, onChange } = this.props;
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    // Clone the current table data
    const newValue = { ...value };
    newValue.rows.splice(rowIndex + 1, 0, {
      _type: 'tableRow',
      _key: uuid(),
      cells: [],
    });
    this.addCell(rowIndex + 1, -1);
    return onChange(createPatchFrom(newValue));
  };

  removeRow = index => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    // Remove the row via index
    newValue.rows.splice(index, 1);
    // If the last row was removed, clear the table
    if (!newValue.rows.length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  addColumn = () => {
    const { value, onChange } = this.props;
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    // Clone the current table data
    const newValue = { ...value };
    // Add a cell to each of the rows
    newValue.rows.forEach((row, i) => {
      newValue.rows[i].cells.push({
        _type: 'cell',
        colspan: 1,
        rowspan: 1,
        data: '',
      });
    });
    return onChange(createPatchFrom(newValue));
  };

  removeColumn = index => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    // For each of the rows, remove the cell by index
    newValue.rows.forEach(row => {
      row.cells.splice(index, 1);
    });
    // If the last cell was removed, clear the table
    if (!newValue.rows[0].cells.length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  selectCell = (rowIndex, cellIndex) => {
    this.setState({ selectedRowIndex: rowIndex, selectedCellIndex: cellIndex });
    if (this.cellInputRef.current && this.cellInputRef.current.focus) {
      this.cellInputRef.current.focus();
    }
  };

  // Unsets the entire table value
  clear = () => {
    const { onChange } = this.props;
    return onChange(PatchEvent.from(unset()));
  };

  // Unsets the entire table value
  clear = () => {
    const { onChange } = this.props;
    return onChange(PatchEvent.from(unset()));
  };

  render() {
    const { type, value } = this.props;
    const { title, description, options } = type;
    const rowIndex = this.state.selectedRowIndex;
    const cellIndex = this.state.selectedCellIndex;
    const cell =
      value && rowIndex > -1 && cellIndex > -1
        ? value.rows[rowIndex].cells[cellIndex]
        : null;

    const renderColors = () => {
      const c = [
        '#31429d',
        '#0d4f45',
        '#f48445',
        '#f40d45',
        '#ffffff',
        '#1f1f1f',
      ];
      const label = (
        <label className={styles.inputLabel} htmlFor="header">
          color:
        </label>
      );
      const colors = c.map(ci => (
        <div
          className={styles.colorSelectionBox}
          style={{ backgroundColor: ci }}
          onClick={() => this.updateCell(ci, rowIndex, cellIndex, 'color')}
        />
      ));
      return [label, colors];
    };

    const renderControls = () =>
      cell ? (
        <div>
          <p>Cell Content</p>
          <div className={styles.controls}>
            <div>
              <input
                style={{ width: '98%' }}
                type="text"
                ref={this.cellInputRef}
                placeholder="enter data.."
                value={cell.data}
                onChange={e =>
                  this.updateCell(e.target.value, rowIndex, cellIndex, 'data')
                }
              />
            </div>
            <div className={styles.cellInternals}>
              <label className={styles.inputLabel} htmlFor="colspan">
                column span:
              </label>
              <input
                className={styles.input}
                placeholder="column span"
                name="colspan"
                type="number"
                value={cell.colspan}
                onChange={e =>
                  this.updateCell(
                    e.target.value,
                    rowIndex,
                    cellIndex,
                    'colspan'
                  )
                }
              />
              <label className={styles.inputLabel} htmlFor="rowspan">
                row span:
              </label>
              <input
                className={styles.input}
                placeholder="row span"
                name="rowspan"
                type="number"
                value={cell.rowspan}
                onChange={e =>
                  this.updateCell(
                    e.target.value,
                    rowIndex,
                    cellIndex,
                    'rowspan'
                  )
                }
              />
              <label className={styles.inputLabel} htmlFor="header">
                header:
              </label>
              <input
                className={styles.input}
                type="checkbox"
                style={{ height: '20px', marginTop: '2px' }}
                checked={cell.header == 'on'}
                onChange={e =>
                  this.updateCell(e.target.value, rowIndex, cellIndex, 'header')
                }
              />
              {renderColors()}
            </div>
            <div className={styles.innerButtonGroup}>
              <ButtonGroup>
                <Button inverted onClick={() => this.addRow(rowIndex)}>
                  Add Row
                </Button>
                <Button
                  inverted
                  onClick={() => this.addCell(rowIndex, cellIndex)}
                >
                  Add Cell
                </Button>
                <Button
                  inverted
                  color="danger"
                  onClick={() => this.removeCell(rowIndex, cellIndex)}
                >
                  Delete Cell
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ) : null;

      const heading = value ? (
        <FormField>
          <div>
            <p>Title</p>
            <TextInput
              type="text"
              ref={this.focusRef}
              value={value.heading === undefined ? '' : value.heading}
              onChange={e => this.updateHeading(e)}
            />
          </div>
        </FormField>
      ) : null;
    const table =
      value && value.rows && value.rows.length ? (
        <div>
          <p>Table Data</p>
          <div className={styles.container}>
            <Table
              rows={value.rows}
              selectCell={this.selectCell}
              selectedRowIndex={this.state.selectedRowIndex}
              selectedCellIndex={this.state.selectedCellIndex}
            />
          </div>
        </div>
      ) : null;

    const controls = value ? renderControls() : null;

    const buttons = value ? null : (
      <Button color="primary" onClick={this.initializeTable}>
        New Table
      </Button>
    );

    return (
      <FieldSet
        legend={title}
        description={description}
        isCollapsible={options.collapsible}
        isCollapsed={options.collapsed}
      >
        {heading}
        {table}
        {controls}
        {buttons}
      </FieldSet>
    );
  }
}
