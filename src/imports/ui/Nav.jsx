import React from 'react';
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/navbar";
import NavB from "react-bootstrap/nav";
import { AppBar, Toolbar, Button, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    navbar: {
        backgroundColor: theme.palette.navigation.main,
    },
    logo: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover': {
            color: theme.palette.text.primary,
        }
    },
    navBtn: {
        backgroundColor: theme.palette.navigation.main,
        color: theme.palette.text.primary,
        marginLeft: '20px',
        '&:hover': {
            backgroundColor: theme.palette.navigation.hover,
            color: theme.palette.text.primary,
        }
    }
}))

export const Nav = () => {
    const classes = useStyles();
    return (
        <AppBar className={classes.navbar} position="static">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    className={classes.logo}
                    component={Link} 
                    to="/">
                    SpaceIntel
                </Typography>
                <Button 
                    variant="contained"
                    disableElevation
                    className={classes.navBtn}
                    component={Link} 
                    to="/satellites">
                    Satellites
                </Button>
                <Button 
                    variant="contained" 
                    disableElevation
                    className={classes.navBtn}
                    component={Link} 
                    to="/schemas">
                    Schemas
                </Button>
                <Button 
                    variant="contained" 
                    disableElevation
                    className={classes.navBtn}
                    component={Link} 
                    to="/about">
                    About
                </Button>
            </Toolbar>
        </AppBar>
    );
};