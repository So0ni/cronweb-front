import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { TextareaAutosize } from '@material-ui/core';
import { getLog } from '../utils/api';
import { PaperDraggable } from './paperDraggable';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  logContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '568px',
    height: '100%',
    maxHeight: '60vh',
  },
  textArea: {
    width: '100%',
    height: '100%',
    resize: 'none',
    overflow: 'scroll !important',
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function LogCat(props) {
  const { open, setOpen, setShotId, shotId } = props;
  const [logContent, setLogContent] = React.useState('');
  const [refreshLog, setRefreshLog] = React.useState(0);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    setShotId('');
  };

  React.useEffect(() => {
    if (shotId) {
      console.log('获取log', shotId);
      getLog(shotId).then((res) => {
        setLogContent(res);
      });
    }
  }, [refreshLog]);

  return (
    <Dialog onClose={handleClose} open={open} PaperComponent={PaperDraggable}>
      <DialogTitle id="draggable">日志</DialogTitle>
      <DialogContent dividers>
        <div className={classes.logContainer}>
          <TextareaAutosize
            className={classes.textArea}
            rowsMax={50}
            rowsMin={25}
            disabled="disabled"
            defaultValue={logContent}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color="primary"
          onClick={() => setRefreshLog(Math.round(Math.random() * 100))}
          style={{ position: 'absolute', left: '8px' }}
        >
          刷新
        </Button>
        <Button autoFocus onClick={handleClose} color="default">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}
