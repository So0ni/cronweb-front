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
import { checkConnection, checkSecret } from '../utils/api';
import {
  getServerHistory,
  addServerHistory,
  delServerHistoryByKey,
  setCurrentLogin,
  getCurrentLogin,
  delCurrentLogin,
} from '../utils/storage';

const historyRows = [
  { server: 'http://127.0.0.1:8000', secret: '', key: 'randomKey0' },
  { server: 'http://127.0.0.1:8000', secret: 'passwd', key: 'randomKey1' },
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
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [server, setServer] = React.useState('');
  const [secret, setSecret] = React.useState('');
  const [historyRows, setHistoryRows] = React.useState(getServerHistory());
  const { logged, setLogged } = props;
  const currentLogin = getCurrentLogin();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const doLogin = (_server, _secret) => {
    checkConnection(_server).then((res) => {
      if (res === true) {
        console.log(_server, '????????????');
        checkSecret(_server, _secret).then((res) => {
          if (res === true) {
            console.log(_server, '????????????');
            addServerHistory(_server, _secret);
            setHistoryRows(getServerHistory());
            setCurrentLogin(_server, _secret);
            console.log('????????????');
            setLogged(true);
          } else {
            console.error(_server, '????????????');
            showSnackbar('?????????????????????');
            delCurrentLogin();
          }
        });
      } else {
        showSnackbar('?????????????????????');
        delCurrentLogin();
        console.error(_server, '????????????');
        return;
      }
    });
  };

  if (currentLogin.server !== null) {
    doLogin(currentLogin.server, currentLogin.secret);
  }

  const handleLoginClick = () => {
    let server_url = server.trim();
    if (server_url === '') {
      showSnackbar('???????????????????????????');
      return;
    }
    if (server_url === 'self') {
      server_url = window.location.href;
    }
    if (server_url.slice(-1) === '/') {
      server_url = server_url.slice(0, -1);
    }
    if (/^(http:)|(https:)+/i.exec(server_url) === null) {
      showSnackbar('?????????????????????http://???https://??????');
      return;
    }
    doLogin(server_url, secret);
  };

  const handleHistoryClick = (_server, _secret) => {
    doLogin(_server, _secret);
  };

  const handleDelHistory = (key) => {
    console.log('??????????????????', key);
    delServerHistoryByKey(key);
    setHistoryRows(getServerHistory());
  };

  return (
    <div className={classes.root}>
      <Snackbar
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        message={snackbarMsg}
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
                <TextField
                  id="server"
                  label="???????????????"
                  onBlur={(e) => setServer(e.target.value)}
                />
              </Grid>
            </Grid>
          </div>
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <VpnKeyIcon />
              </Grid>
              <Grid item xs>
                <TextField
                  id="secret"
                  label="??????(??????)"
                  type="password"
                  onBlur={(e) => setSecret(e.target.value)}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid container alignItems="center" justify="flex-start">
          <Typography
            variant="caption"
            display="block"
            style={{ color: 'grey', marginLeft: '8px' }}
          >
            ??????server???????????????????????????????????????self
          </Typography>
        </Grid>

        <div className={classes.loginButton}>
          <Button variant="outlined" color="primary" onClick={handleLoginClick}>
            ??????
          </Button>
        </div>

        <div className={classes.historyList}>
          <List component="nav" aria-label="main mailbox folders">
            {historyRows.map((row) => {
              return (
                <ListItem
                  button
                  key={row.key}
                  onClick={() => handleHistoryClick(row.server, row.secret)}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      row.secret.length === 0 ? row.server : row.server + ' *'
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelHistory(row.key)}
                    >
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
