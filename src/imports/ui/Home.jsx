import React from 'react';
import { SatCard } from "./SatCard.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';
import { Container, TextField,Grid, Typography, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles((theme) => ({
    jumbo: {
        paddingTop: '60px',
    },
    showcase: {
        marginTop: '60px',
    }
}))

export const Home = () => {
    const classes = useStyles();

    const [demoSats, isLoading] = useTracker(() => {
        const sub = Meteor.subscribe('satellites');
        const sats = SatelliteCollection.find({}, {limit: 3}).fetch();
        return [sats, !sub.ready()]
    });

    return(
        <React.Fragment>
            <Container className={classes.jumbo} maxWidth="md">
                <Typography variant="h2">Welcome to <strong>SpaceIntel!</strong></Typography>
                <Typography variant="body1">
                    SpaceIntel is seeking to become the world's most complete and easy to use resource for spacecraft data and information.
                </Typography>
                <Typography variant="subtitle1">
                    100% Open Source, 100% Machine Readable. 
                    </Typography>
            </Container>
            <Container className={classes.showcase} maxWidth="md">
                <Typography variant="h4" gutterBottom>Some example data</Typography>
                <Grid container justify="center" spacing={2}>
                    { !isLoading &&
                        demoSats.map((sat, index) => (
                            <Grid item xs key={index}>
                                <SatCard satellite={sat} key={index}/>
                            </Grid>
                        ))
                    }
                    { isLoading && 
                        <React.Fragment>
                            <Grid item xs>
                                <Skeleton variant="rect" width={280} height={415} />
                            </Grid>
                            <Grid item xs>
                                <Skeleton variant="rect" width={280} height={415} />
                            </Grid>
                            <Grid item xs>
                                <Skeleton variant="rect" width={280} height={415} />
                            </Grid>
                        </React.Fragment>
                    }
                </Grid>
            </Container>
        </React.Fragment>
    );
};