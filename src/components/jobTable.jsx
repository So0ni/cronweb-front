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
import { PaperDraggable } from './paperDraggable';

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
    label: '??????',
    sortable: true,
  },
  {
    id: 'cron_exp',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '??????',
    sortable: true,
  },
  {
    id: 'param',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '??????',
    sortable: true,
  },
  {
    id: 'command',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '??????',
    sortable: true,
  },
  {
    id: 'date_create',
    numeric: false,
    align: 'left',
    disablePadding: false,
    label: '????????????',
    sortable: true,
  },
  {
    id: 'active',
    numeric: false,
    align: 'center',
    disablePadding: true,
    label: '??????',
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
        <DialogTitle id="alert-dialog-title">{'??????'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ????????????{selected.length}
            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            ??????
          </Button>
          <Button onClick={handleDeleteDialogAgree} color="secondary">
            ??????
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
          ????????? {selected.length} ???
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          ????????????
        </Typography>
      )}

      {selected.length > 0 ? (
        <Tooltip title="??????">
          <IconButton aria-label="??????" onClick={handleDeleteDialogOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div style={{ display: 'flex' }}>
          <Tooltip title="Cron??????">
            <IconButton aria-label="Cron??????" onClick={handleCronHelpClick}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="????????????">
            <IconButton aria-label="????????????" onClick={props.onAddJobClick}>
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

const useSimpleDialogStyles = makeStyles((theme) => ({
  rowDialog: {
    marginBottom: '0.7em',
    paddingBottom: '0.5em',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
}));

function SimpleDialog(props) {
  const { uuid, setUuid, open, setOpen, jobInfo, tableUpdate, notify } = props;
  const [enableTriggerButton, setEnableTriggerButton] = React.useState(true);
  const classes = useSimpleDialogStyles();
  const handlesTimeout = [];

  const handleClose = () => {
    setOpen(false);
    setUuid('');
  };

  React.useEffect(() => {
    return () => handlesTimeout.map((handle) => clearTimeout(handle));
  }, []);

  const handleTriggerClick = (_uuid) => {
    setEnableTriggerButton(false);
    triggerJob(_uuid).then((res) => {
      if (res === 0) {
        notify('??????????????????');
        setTimeout(() => tableUpdate(Math.round(Math.random() * 100)), 1000);
        handlesTimeout.push(
          setTimeout(() => {
            setEnableTriggerButton(true);
          }, 3000),
        );
      }
    });
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
      PaperComponent={PaperDraggable}
    >
      <DialogTitle id="draggable">????????????</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2">?????????</Typography>
        <Typography variant="subtitle1" className={classes.rowDialog}>
          {jobInfo.name}
        </Typography>

        <Typography variant="subtitle2">Cron?????????</Typography>
        <Typography variant="subtitle1" className={classes.rowDialog}>
          {jobInfo.cron_exp}
        </Typography>

        <Typography variant="subtitle2">??????</Typography>
        <Typography variant="subtitle1" className={classes.rowDialog}>
          {jobInfo.command}
        </Typography>

        <Typography variant="subtitle2">??????</Typography>
        <Typography variant="subtitle1" className={classes.rowDialog}>
          {jobInfo.param ? jobInfo.param : '?????????'}
        </Typography>

        <Typography variant="subtitle2">??????</Typography>
        <Typography variant="subtitle1">
          {jobInfo.active === 1 ? '?????????' : '?????????'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleTriggerClick(uuid)}
          color="secondary"
          disabled={!enableTriggerButton}
          style={{ position: 'absolute', left: '8px' }}
        >
          ????????????
        </Button>
        <Button onClick={handleClose} color="primary">
          ??????
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
  const [msgNotify, setMsgNotify] = React.useState({ open: false, msg: '' });

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
    console.log('????????????', selected);
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

  const handleSwitchJobState = (uuid, active) => {
    console.log('????????????active uuid:', uuid, 'active=', active);
    updateJobState(uuid, active).then((res) => {
      tableUpdate(Math.round(Math.random() * 100));
    });
  };

  const handleNotifyClose = () => {
    setMsgNotify({ open: false, msg: '' });
  };

  const notify = (msg) => {
    setMsgNotify({ open: true, msg: msg });
  };

  return (
    <div className={classes.root}>
      <AddJob
        open={addJobOpen}
        setOpen={setAddJobOpen}
        jobs={rows}
        setJobs={setRows}
        tableUpdate={tableUpdate}
        notify={notify}
      />
      {jobDialogOpen ? (
        <SimpleDialog
          open={jobDialogOpen}
          setOpen={setJobDialogOpen}
          uuid={jobDialogUuid}
          setUuid={setJobDialogUuid}
          jobInfo={jobInfo}
          tableUpdate={tableUpdate}
          notify={notify}
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

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={msgNotify.open}
        autoHideDuration={1500}
        onClose={handleNotifyClose}
        message={msgNotify.msg}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleNotifyClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

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
                          name="????????????"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} align="center">
                    {rows.length === 0 ? <Empty>?????????</Empty> : null}
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
