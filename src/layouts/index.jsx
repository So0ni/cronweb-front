import React from 'react';
import styles from './index.less';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import LoginPage from '../components/login';

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
  // return (
  //   <LoginPage/>
  // )
  return (
    <div className={styles.container}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              CronWeb
            </Typography>
            <Button color="inherit">退出</Button>
          </Toolbar>
        </AppBar>
        <div className={styles.contentContainer} style={{ padding: 20 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
