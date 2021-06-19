import React from 'react';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, makeStyles, IconButton } from '@material-ui/core';
import { themes } from './Themes.jsx'
import BrightnessHigh from '@material-ui/icons/BrightnessHigh';
import Brightness4 from '@material-ui/icons/Brightness4';

const useStyles = makeStyles((theme) => ({
    navbar: {
        backgroundColor: theme.palette.navigation.main,
    },
    toolbar: {
        justifyContent: 'space-between',
    },
    logo: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover': {
            color: theme.palette.text.primary,
        }
    },
    links: {
        display: "flex",
        alignItems: "center",
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

export const Nav = ({ theme, toggleTheme }) => {
    const classes = useStyles();
    return (
        <AppBar className={classes.navbar} position="static">
            <Toolbar className={classes.toolbar}>
                <div className={classes.links}>
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
                </div>
                {theme === themes.dark ?
                    (
                        <IconButton edge="end" aria-label="light theme" onClick={toggleTheme}>
                            <BrightnessHigh/>
                        </IconButton>
                    ) : (
                        <IconButton edge="end" aria-label="dark theme" onClick={toggleTheme}>
                            <Brightness4 />
                        </IconButton>
                    )
                }
            </Toolbar>
        </AppBar>
    );
};