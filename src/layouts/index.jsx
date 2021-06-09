import React from 'react';
import styles from './index.less';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import LoginPage from '../components/login';
import { delCurrentLogin } from '../utils/storage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default (props) => {
  const classes = useStyles();
  const [logged, setLogged] = React.useState(false);

  const logout = () => {
    delCurrentLogin();
    setLogged(false);
  };

  return !logged ? (
    <LoginPage logged={logged} setLogged={setLogged} />
  ) : (
    <div className={styles.container}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              CronWeb
            </Typography>
            <Button color="inherit" onClick={logout}>
              退出
            </Button>
          </Toolbar>
        </AppBar>
        <div className={styles.contentContainer} style={{ padding: 20 }}>
          {React.cloneElement(props.children, { setLogged })}
        </div>
      </div>
    </div>
  );
};
