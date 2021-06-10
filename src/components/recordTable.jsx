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
import { getAllRecords } from '../utils/api';

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
          查看日志
        </TableCell>
      </TableRow>
    </TableHead>
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

  const handleLogCatClick = () => {
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

  return (
    <div className={classes.root}>
      <LogCat open={logCatOpen} setOpen={setLogCatOpen} />
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
                        <IconButton
                          aria-label="cat-log"
                          size="small"
                          onClick={handleLogCatClick}
                        >
                          <EventNoteIcon />
                        </IconButton>
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
