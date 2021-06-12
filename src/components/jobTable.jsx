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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Empty from './empty';
import AddJob from './addJob';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  Snackbar,
  Switch,
} from '@material-ui/core';
import { CronIntro } from './cronIntro';
import HelpIcon from '@material-ui/icons/Help';
import { ControlPoint } from '@material-ui/icons';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { deleteJobs, triggerJob, updateJobState } from '../utils/api';
import CloseIcon from '@material-ui/icons/Close';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    align: 'left',
    disablePadding: true,
    label: '名称',
    sortable: true,
  },
  {
    id: 'cron_exp',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '定时',
    sortable: true,
  },
  {
    id: 'param',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '参数',
    sortable: true,
  },
  {
    id: 'command',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '命令',
    sortable: true,
  },
  {
    id: 'date_create',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '创建日期',
    sortable: true,
  },
  {
    id: 'active',
    numeric: false,
    align: 'center',
    disablePadding: true,
    label: '状态',
    sortable: false,
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all jobs' }}
          />
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { selected, onDeleteClick, setAnchorEl, setPopperOpen } = props;
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleCronHelpClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogAgree = () => {
    onDeleteClick();
    setDeleteDialogOpen(false);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selected.length > 0,
      })}
    >
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'警告'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            你选中了{selected.length}
            条任务。删除后的任务对应的运行记录也会被删除，你将不能再看到任务的历史运行记录和日志。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            取消
          </Button>
          <Button onClick={handleDeleteDialogAgree} color="secondary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
      {selected.length > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          已选中 {selected.length} 条
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          任务列表
        </Typography>
      )}

      {selected.length > 0 ? (
        <Tooltip title="删除">
          <IconButton aria-label="删除" onClick={handleDeleteDialogOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div style={{ display: 'flex' }}>
          <Tooltip title="Cron帮助">
            <IconButton aria-label="Cron帮助" onClick={handleCronHelpClick}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="新建任务">
            <IconButton aria-label="新建任务" onClick={props.onAddJobClick}>
              <ControlPoint style={{ color: 'rgba(0, 171, 85, 0.85)' }} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  onAddJobClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

function SimpleDialog(props) {
  const { uuid, setUuid, open, setOpen, jobInfo } = props;
  const [enableTriggerButton, setEnableTriggerButton] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setEnableTriggerButton(true);
    setUuid('');
  };

  React.useEffect(() => {
    const handleTimeout = setTimeout(() => {
      setEnableTriggerButton(true);
    }, 3000);
    return () => clearTimeout(handleTimeout);
  }, [snackbarOpen]);

  const handleTriggerClick = (_uuid) => {
    setEnableTriggerButton(false);
    triggerJob(_uuid).then((res) => {
      if (res === 0) {
        setSnackbarOpen(true);
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      3
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="触发成功"
        autoHideDuration={3000}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <DialogTitle>任务详情</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2">任务名</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '1.25em' }}>
          {jobInfo.name}
        </Typography>

        <Typography variant="subtitle2">Cron表达式</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '1.25em' }}>
          {jobInfo.cron_exp}
        </Typography>

        <Typography variant="subtitle2">命令</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '1.25em' }}>
          {jobInfo.command}
        </Typography>

        <Typography variant="subtitle2">参数</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '1.25em' }}>
          {jobInfo.param ? jobInfo.param : '无参数'}
        </Typography>

        <Typography variant="subtitle2">状态</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '1.25em' }}>
          {jobInfo.active === 1 ? '已启动' : '已停止'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleTriggerClick(uuid)}
          color="secondary"
          disabled={!enableTriggerButton}
          style={{ position: 'absolute', left: '8px' }}
        >
          手动触发
        </Button>
        <Button onClick={handleClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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

export default function JobTable(props) {
  const { rows, setRows, tableUpdate } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [addJobOpen, setAddJobOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popperOpen, setPopperOpen] = React.useState(false);
  const [jobDialogUuid, setJobDialogUuid] = React.useState('');
  const [jobDialogOpen, setJobDialogOpen] = React.useState(false);
  const [jobInfo, setJobInfo] = React.useState({
    uuid: '',
    name: '',
    cron_exp: '',
    command: '',
    param: '',
    date_create: '',
    active: 1,
  });

  const handleAddJobClick = () => {
    setAddJobOpen(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.uuid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleDeleteClick = () => {
    console.log('删除任务', selected);
    deleteJobs(selected).then((res) => {
      setSelected([]);
      tableUpdate(Math.round(Math.random() * 100));
    });
  };

  const handleCheck = (event, uuid) => {
    const selectedIndex = selected.indexOf(uuid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, uuid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function handleSwitchJobState(uuid, active) {
    console.log('修改任务active uuid:', uuid, 'active=', active);
    updateJobState(uuid, active).then((res) => {
      tableUpdate(Math.round(Math.random() * 100));
    });
  }

  return (
    <div className={classes.root}>
      <AddJob
        open={addJobOpen}
        setOpen={setAddJobOpen}
        jobs={rows}
        setJobs={setRows}
        tableUpdate={tableUpdate}
      />
      {jobDialogOpen ? (
        <SimpleDialog
          open={jobDialogOpen}
          setOpen={setJobDialogOpen}
          uuid={jobDialogUuid}
          setUuid={setJobDialogUuid}
          jobInfo={jobInfo}
        />
      ) : null}

      <Popover
        open={popperOpen}
        anchorEl={anchorEl}
        onClose={() => setPopperOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <CronIntro />
      </Popover>

      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          selected={selected}
          onAddJobClick={handleAddJobClick}
          setAnchorEl={setAnchorEl}
          setPopperOpen={setPopperOpen}
          onDeleteClick={handleDeleteClick}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.uuid);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {
                        setJobDialogUuid(row.uuid);
                        setJobInfo(row);
                        setJobDialogOpen(true);
                      }}
                      tabIndex={-1}
                      key={row.uuid}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => {
                            handleCheck(event, row.uuid);
                            event.stopPropagation();
                          }}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {row.cron_exp.length < 15
                          ? row.cron_exp
                          : row.cron_exp.slice(0, 15) + '...'}
                      </TableCell>
                      <TableCell align="left">{row.param}</TableCell>
                      <TableCell align="left">
                        {row.command.length < 10
                          ? row.command
                          : row.command.slice(0, 10) + '...'}
                      </TableCell>
                      <TableCell align="left">
                        {row.date_create.slice(0, 16)}
                      </TableCell>
                      <TableCell
                        align="center"
                        padding="none"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Switch
                          checked={row.active === 1}
                          onChange={(event) => {
                            handleSwitchJobState(
                              row.uuid,
                              row.active === 1 ? 0 : 1,
                            );
                          }}
                          color="primary"
                          name="任务状态"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} align="center">
                    {rows.length === 0 ? <Empty>无任务</Empty> : null}
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
