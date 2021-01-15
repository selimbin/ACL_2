import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        GUC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(/Login1.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
  

export default function Login() {
  // let history = useHistory();
  var state={
    email:'',
    password:''
  }
  const myChangeHandler = (event) => {
    // alert(event.target.value)
    let nam = event.target.name;
    let val = event.target.value;
    if(nam=="email"){
      state={
        email:val,
        password:state.password
      }
    }
    else{
      state={
        email:state.email,
        password:val
      }
    }
}
  const handleClick = event => {
    event.preventDefault();
    // var self = this;
    const payload={
      email:state.email,
      password:state.password
    }
    axios.post("http://localhost:5000/login", payload,{
      headers:
      {
          "Access-Control-Allow-Origin": "*",
          "Content-Type":"application/JSON"
      }
    })
    .then(function (response) {
      // console.log(response);
      if(response.data.code==401){
        console.log("Username does not exists");
        alert("Username does not exist");
      }
      else if(response.data.code == 400){
        console.log("Username password do not match");
        alert("username password do not match")
      }
      else{
        sessionStorage.setItem("token", response.data.token);
        if(response.data.role=="HR"){
          sessionStorage.setItem("role", "HR");
          window.location.href='/Home' 
        }
        if(response.data.role=="TA"){
          sessionStorage.setItem("role", "TA");
          window.location.href='/Home' 

        }
        if(response.data.role=="lecturer"){
          if(response.data.isHOD=="true"){
            sessionStorage.setItem("role", "HOD");
            window.location.href='/Home' 
          }
          else{
            sessionStorage.setItem("role", "Lec");
            window.location.href='/Home' 
          }

        }
      }
    })
    .catch(function (error) {
      alert(error)
      console.log(error);
    });
    }

  
  const classes = useStyles(); 
  
  return (
    <div className='login-wrapper'>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
            
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={myChangeHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={myChangeHandler}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(event) => handleClick(event)}
            >
              Login
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
        </div>
      </Grid>
    </Grid>
    </div>
  )
}
Login.propTypes = {
  setToken: PropTypes.func.isRequired
};