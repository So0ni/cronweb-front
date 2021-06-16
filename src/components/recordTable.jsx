import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Paper from '@material-ui/core/Paper';
import Empty from './empty';
import LogCat from '../components/logCat';
import IconButton from '@material-ui/core/IconButton';
import RecordStateBadge from './recordStateBadge';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import { getAllRecords, stopRunningJob } from '../utils/api';
import { HighlightOff } from '@material-ui/icons';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell key="name">任务名</TableCell>
        <TableCell key="state" align="center">
          状态
        </TableCell>
        <TableCell key="date_start">运行开始</TableCell>
        <TableCell key="date_end">运行结束</TableCell>
        <TableCell key="view_log" align="center">
          操作
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function StopDialog(props) {
  const { open, setOpen, shotId, notify, tableUpdate } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleStopClick = () => {
    stopRunningJob(shotId).then((res) => {
      notify('中止成功');
      setTimeout(() => tableUpdate(Math.round(Math.random() * 100)), 1500);
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'确定中止任务吗?'}</DialogTitle>
      {/*<DialogContent>*/}
      {/*  <DialogContentText id="alert-dialog-description">*/}
      {/*    Let Google help apps determine location. This means sending anonymous location data to*/}
      {/*    Google, even when no apps are running.*/}
      {/*  </DialogContentText>*/}
      {/*</DialogContent>*/}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={handleStopClick} color="primary" autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  titleRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  titleHighlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  },
  title: {
    flex: '1 1 100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function RecordTable(props) {
  const { rows, setRows, tableUpdate } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [logCatOpen, setLogCatOpen] = React.useState(false);
  const [shotIdLogCat, setShotIdLogCat] = React.useState('');
  const [stopDialogOpen, setStopDialogOpen] = React.useState(false);
  const [shotIdStop, setShotIdStop] = React.useState('');
  const [msgNotify, setMsgNotify] = React.useState({ open: false, msg: '' });

  const handleLogCatClick = (shotId) => {
    console.log('点击日志查看', shotId);
    setShotIdLogCat(shotId);
    setLogCatOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleRefreshClick = () => {
    tableUpdate(Math.round(Math.random() * 100));
  };

  const handleStopClick = (_shotId) => {
    console.log(_shotId);
    setShotIdStop(_shotId);
    setStopDialogOpen(true);
  };

  const notify = (msg) => {
    setMsgNotify({ open: true, msg: msg });
  };

  const notifyClose = () => {
    setMsgNotify({ open: false, msg: '' });
  };

  return (
    <div className={classes.root}>
      {logCatOpen ? (
        <LogCat
          open={logCatOpen}
          setOpen={setLogCatOpen}
          shotId={shotIdLogCat}
          setShotId={setShotIdLogCat}
        />
      ) : null}
      {stopDialogOpen ? (
        <StopDialog
          open={stopDialogOpen}
          setOpen={setStopDialogOpen}
          shotId={shotIdStop}
          notify={notify}
          tableUpdate={tableUpdate}
        />
      ) : null}
      {msgNotify.open ? (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={msgNotify.open}
          onClose={notifyClose}
          message={msgNotify.msg}
        />
      ) : null}
      <Paper className={classes.paper}>
        <Toolbar className={classes.titleRoot}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            运行记录
          </Typography>

          <Tooltip title="刷新">
            <IconButton aria-label="刷新" onClick={handleRefreshClick}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead classes={classes} />
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.shot_id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">
                        <RecordStateBadge stateType={row.state} />
                      </TableCell>
                      <TableCell align="left">
                        {row.date_start.slice(0, 19)}
                      </TableCell>
                      <TableCell align="left">
                        {row.date_end ? row.date_end.slice(0, 19) : null}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="查看日志">
                          <IconButton
                            aria-label="cat-log"
                            size="small"
                            onClick={() => handleLogCatClick(row.shot_id)}
                          >
                            <EventNoteIcon />
                          </IconButton>
                        </Tooltip>
                        {row.state === 'RUNNING' ? (
                          <Tooltip title="停止运行">
                            <IconButton
                              aria-label="stop-running"
                              size="small"
                              onClick={() => handleStopClick(row.shot_id)}
                            >
                              <HighlightOff
                                style={{ color: 'rgba(255, 72, 66, 0.85)' }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 43 * emptyRows }}>
                  <TableCell colSpan={5} align="center">
                    {rows.length === 0 ? <Empty>无运行记录</Empty> : null}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
