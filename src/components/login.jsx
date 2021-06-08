import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import StorageIcon from '@material-ui/icons/Storage';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

const historyRows = [
  { url: 'http://127.0.0.1:8000', secret: '', key: 'randomKey0' },
  { url: 'http://127.0.0.1:8000', secret: 'passwd', key: 'randomKey1' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  loginDialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '10vh',
  },
  margin: {
    margin: theme.spacing(1),
  },
  banner: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
    alignItems: 'center',
    flexDirection: 'column',
  },
  bannerIcon: {
    fontSize: '40px',
    '&:hover': {
      color: 'grey',
    },
  },
  loginButton: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: theme.spacing(4),
  },
  historyList: {
    marginTop: theme.spacing(4),
  },
}));

export default function LoginPage(props) {
  const classes = useStyles();
  const [snackbarOpen, setSnackbarOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        message="登陆失败"
      />

      <div className={classes.loginDialog}>
        <div className={classes.banner}>
          <ScheduleIcon className={classes.bannerIcon} />
          <Typography variant="h6" id="tableTitle" component="div">
            CronWeb
          </Typography>
        </div>

        <Grid container alignItems="center" justify="center">
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <StorageIcon />
              </Grid>
              <Grid item xs>
                <TextField id="server" label="服务器地址" />
              </Grid>
            </Grid>
          </div>
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <VpnKeyIcon />
              </Grid>
              <Grid item xs>
                <TextField id="secret" label="密码(可选)" type="password" />
              </Grid>
            </Grid>
          </div>
        </Grid>

        <div className={classes.loginButton}>
          <Button variant="outlined" color="primary">
            登陆
          </Button>
        </div>

        <div className={classes.historyList}>
          <List component="nav" aria-label="main mailbox folders">
            {historyRows.map((row, idx) => {
              return (
                <ListItem button key={row.key}>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={row.secret.length === 0 ? row.url : row.url + ' *'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
}
