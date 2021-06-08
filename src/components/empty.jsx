import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export default function Empty(props) {
  return (
    <div>
      <ErrorOutlineIcon style={{ color: 'gray', fontSize: '50px' }} />
      <Typography color="textSecondary">{props.children}</Typography>
    </div>
  );
}
