import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { addJob } from '../utils/api';
import { Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  inputField: {
    minHeight: '69px',
  },
}));

export default function AddJob(props) {
  const { open, setOpen, tableUpdate } = props;
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [name, setName] = React.useState('');
  const [cronExp, setCronExp] = React.useState('');
  const [command, setCommand] = React.useState('');
  const [param, setParam] = React.useState('');

  const [nameErr, setNameErr] = React.useState({ show: false, msg: 'hello' });
  const [cronExpErr, setCronExpErr] = React.useState({ show: false, msg: '' });
  const [commandErr, setCommandErr] = React.useState({ show: false, msg: '' });

  const classes = useStyles();

  const handleClose = (event) => {
    if (event.type === 'mouseup') {
      return;
    }
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmitClick = () => {
    let flagCheck = 0;
    if (name.length === 0) {
      setNameErr({ show: true, msg: '任务名称是必填项' });
      flagCheck = 1;
    }
    if (cronExp.length === 0) {
      setCronExpErr({ show: true, msg: 'Cron表达式是必填项' });
      flagCheck = 1;
    }
    if (command.length === 0) {
      setCommandErr({ show: true, msg: '命令是必填项' });
      flagCheck = 1;
    }
    if (flagCheck === 1) {
      return;
    }
    addJob({
      name: name.trim(),
      cron_exp: cronExp.trim(),
      command: command.trim(),
      param: param.trim(),
    }).then((res) => {
      if (res === 0) {
        tableUpdate(Math.round(Math.random() * 100));
        setOpen(false);
        return;
      }
      if (res === 2) {
        setCronExpErr({ show: true, msg: 'Cron表达式无效' });
      }
    });
  };

  const cronParse = (_cronExp) => {
    if (!_cronExp) {
      return '';
    }
    const cronEle = _cronExp.trim().split(/\s+/);
    if (cronEle.length === 5) {
      return `分:${cronEle[0]} 时:${cronEle[1]} 日:${cronEle[2]} 月:${cronEle[3]} 星期:${cronEle[4]} `;
    }
    if (cronEle.length === 6) {
      return `秒:${cronEle[0]} 分:${cronEle[1]} 时:${cronEle[2]} 日:${cronEle[3]} 月:${cronEle[4]}  星期:${cronEle[5]} `;
    }
    return 'Cron表达式有误';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        message="任务添加成功"
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
      <DialogTitle id="form-dialog-title">新建任务</DialogTitle>
      <DialogContent>
        <DialogContentText>
          使用Cron表达式建立一个定时任务。普通参数在命令中填写，填写在参数选项中的内容将会以"--param"的方式传递，
          如果命令不支持可能会报错。
        </DialogContentText>
        <TextField
          className={classes.inputField}
          autoFocus
          id="name"
          label="任务名"
          fullWidth
          onBlur={(event) => {
            setName(event.target.value);
            setNameErr({ show: false, msg: '' });
          }}
          error={nameErr.show}
          helperText={nameErr.msg}
        />

        <TextField
          className={classes.inputField}
          autoFocus
          id="cron_exp"
          label="Cron表达式"
          fullWidth
          onBlur={(event) => {
            setCronExp(event.target.value);
            setCronExpErr({ show: false, msg: cronParse(event.target.value) });
          }}
          error={cronExpErr.show}
          helperText={cronExpErr.msg}
        />

        <TextField
          className={classes.inputField}
          autoFocus
          id="command"
          label="命令"
          fullWidth
          onBlur={(event) => {
            setCommand(event.target.value);
            setCommandErr({ show: false, msg: '' });
          }}
          error={commandErr.show}
          helperText={commandErr.msg}
        />
        <TextField
          className={classes.inputField}
          autoFocus
          id="param"
          label="参数(可选)"
          fullWidth
          onBlur={(event) => setParam(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmitClick} color="primary">
          提交
        </Button>
        <Button onClick={handleClose} color="secondary">
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
}
