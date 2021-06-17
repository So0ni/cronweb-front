import React from 'react';
import { Paper } from '@material-ui/core';
import Draggable from 'react-draggable';

function PaperDraggable(props) {
  return (
    <Draggable handle="#draggable" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export { PaperDraggable };
