import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ButtonBase, Typography } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
    minWidth: 270,
  },
}));

export default function InfoBread(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs sm={12} container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid
                item
                xs
                direction="column"
                justify="center"
                alignItems="flex-start"
                style={{ display: 'flex' }}
              >
                <Typography gutterBottom variant="subtitle2" color="initial">
                  {props.text}
                </Typography>
                <Typography
                  variant="h3"
                  gutterBottom
                  style={{ ...props.color }}
                >
                  {props.value}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              style={{ display: 'flex', alignItems: 'center', ...props.color }}
            >
              {props.children}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
