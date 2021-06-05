import styles from './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InfoBread from '../components/infoBread';
import SyncIcon from '@material-ui/icons/Sync';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs sm container>
        <InfoBread
          text={'总任务数'}
          value={10}
          color={{ color: 'rgba(24, 144, 255, 0.85)' }}
        >
          <AccessAlarmIcon style={{ fontSize: '48px' }} />
        </InfoBread>
      </Grid>
      <Grid item xs sm container>
        <InfoBread
          text={'今日运行次数'}
          value={101}
          color={{ color: 'rgba(0, 171, 85, 0.85)' }}
        >
          <SyncIcon style={{ fontSize: '48px' }} />
        </InfoBread>
      </Grid>
      <Grid item xs sm container>
        <InfoBread
          text={'今日失败次数'}
          value={5}
          color={{ color: 'rgba(255, 72, 66, 0.85)' }}
        >
          <WarningIcon style={{ fontSize: '48px' }} />
        </InfoBread>
      </Grid>
    </Grid>
  );
}
