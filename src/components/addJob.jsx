import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AddJob(props) {
  const { open, setOpen } = props;

  const handleClickOpen = (event) => {
    setOpen(true);
  };

  const handleClose = (event) => {
    if (event.type === 'mouseup') {
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">新建任务</DialogTitle>
      <DialogContent>
        <DialogContentText>
          使用Cron表达式建立一个定时任务。普通参数在命令中填写，填写在参数选项中的内容将会以"--param"的方式传递，
          如果命令不支持可能会报错。
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="任务名"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="cron_exp"
          label="Cron表达式"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="command"
          label="命令"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="param"
          label="参数(可选)"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          提交
        </Button>
        <Button onClick={handleClose} color="secondary">
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
}
