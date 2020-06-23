import React from 'react';
import { Glyphicon, OverlayTrigger } from 'react-bootstrap';
import { Collapse } from 'react-bootstrap';

const DataCellUI = ({value, details, align}) =>
  <td className={align}>
    <span>
      <span className='text-nowrap'>{value && value.length >= 20 ? value.slice(0,20) + "..." : value}</span>
      { details && <br/> }
      { details && <small>{details}</small> }
    </span>
  </td>

export default DataCellUI;
