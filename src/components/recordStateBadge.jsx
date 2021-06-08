import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
    borderRadius: '10px',
    fontSize: '10px',
    width: '40px',
    margin: 'auto',
  },
}));

const stateMapping = {
  RUNNING: {
    label: '运行',
    style: { backgroundColor: '#2196f3' },
  },
  DONE: {
    label: '完成',
    style: { backgroundColor: '#4caf50' },
  },
  KILLED: {
    label: '中止',
    style: { backgroundColor: '#ff9800' },
  },
  ERROR: {
    label: '错误',
    style: { backgroundColor: '#f44336' },
  },
  UNKNOWN: {
    label: '未知',
    style: { backgroundColor: '#323232' },
  },
};

export default function RecordStateBadge(props) {
  const classes = useStyles();
  const state = stateMapping[props.stateType];

  return (
    <div className={classes.root} style={state.style}>
      {state.label}
    </div>
  );
}
