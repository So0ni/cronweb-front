import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InfoBread from '../components/infoBread';
import JobTable from '../components/jobTable';
import SyncIcon from '@material-ui/icons/Sync';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import WarningIcon from '@material-ui/icons/Warning';
import RecordTable from '../components/recordTable';
import { updateTables } from '../utils/api';

const jobRows = [
  {
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    cron_exp: '*/1 * * * *',
    command: 'python -c "import time;time.sleep(30);print(\'done\')"',
    param: '',
    name: '测试',
    date_create: '2021-06-01 00:46:39.090237',
    date_update: '2021-06-01 00:46:39.090237',
  },
];

const recordRows = [
  {
    shot_id: '676c3537b640ac',
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    state: 'DONE',
    log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
    date_start: '2021-06-01 00:47:00.020000',
    date_end: '2021-06-01 00:47:30.067080',
    name: '由uuid查询',
  },
  {
    shot_id: '8c4ac3537b640ac',
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    state: 'KILLED',
    log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
    date_start: '2021-06-01 00:47:00.020000',
    date_end: '2021-06-01 00:47:30.067080',
    name: '由uuid查询',
  },
  {
    shot_id: '6763837b640ac',
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    state: 'ERROR',
    log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
    date_start: '2021-06-01 00:47:00.020000',
    date_end: '2021-06-01 00:47:30.067080',
    name: '由uuid查询',
  },
  {
    shot_id: '95a8c4537b640ac',
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    state: 'RUNNING',
    log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
    date_start: '2021-06-01 00:47:00.020000',
    date_end: '2021-06-01 00:47:30.067080',
    name: '由uuid查询',
  },
  {
    shot_id: '676389e11bf04',
    uuid: 'ee5141b095d0426dbd3b375aa00de533',
    state: 'UNKNOWN',
    log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
    date_start: '2021-06-01 00:47:00.020000',
    date_end: '2021-06-01 00:47:30.067080',
    name: '由uuid查询',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  columnGrid: {
    width: 'calc(100% - 10px)',
    margin: '15px 5px',
  },
  breadIcon: {
    fontSize: '48px',
  },
  title: {
    background: 'rgb(121, 242, 157)',
  },
}));

export default function App(props) {
  const classes = useStyles();
  const [jobList, setJobList] = React.useState([]);
  const [recordList, setRecordList] = React.useState([]);
  const [breadInfo, setBreadInfo] = React.useState({
    totalJobCount: 0,
    todayRecordCount: 0,
    todayFailedCount: 0,
  });
  const [tableUpdate, setTableUpdate] = React.useState(0);
  const { setLogged } = props;

  useEffect(() => {
    const update = async () => {
      console.log('更新数据');
      await updateTables(setLogged, setJobList, setRecordList, setBreadInfo);
    };
    update();
  }, [tableUpdate]);

  useEffect(() => {
    const handleInterval = setInterval(
      () => setTableUpdate(Math.round(Math.random() * 100)),
      30000,
    );
    return () => clearInterval(handleInterval);
  }, []);

  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Grid container spacing={3}>
        <Grid item xs sm container>
          <InfoBread
            text={'总任务数'}
            value={breadInfo.totalJobCount}
            color={{ color: 'rgba(24, 144, 255, 0.85)' }}
          >
            <AccessAlarmIcon className={classes.breadIcon} />
          </InfoBread>
        </Grid>
        <Grid item xs sm container>
          <InfoBread
            text={'今日运行次数'}
            value={breadInfo.todayRecordCount}
            color={{ color: 'rgba(0, 171, 85, 0.85)' }}
          >
            <SyncIcon className={classes.breadIcon} />
          </InfoBread>
        </Grid>
        <Grid item xs sm container>
          <InfoBread
            text={'今日失败次数'}
            value={breadInfo.todayFailedCount}
            color={{ color: 'rgba(255, 72, 66, 0.85)' }}
          >
            <WarningIcon className={classes.breadIcon} />
          </InfoBread>
        </Grid>
      </Grid>

      <Grid className={classes.columnGrid}>
        <JobTable
          rows={jobList}
          setRows={setJobList}
          tableUpdate={setTableUpdate}
        />
      </Grid>

      <Grid className={classes.columnGrid}>
        <RecordTable
          rows={recordList}
          setRows={setRecordList}
          tableUpdate={setTableUpdate}
        />
      </Grid>
    </Grid>
  );
}
