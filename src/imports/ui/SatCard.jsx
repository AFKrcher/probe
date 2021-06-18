import React from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Clamp from 'react-multiline-clamp'

const useStyles = makeStyles((theme) => ({
    satCard: {
        width: '100%',
    },
    image: {
        height: '150px',
    },
    description: {
        height: '130px',
    }
}));

export const SatCard = ({satellite, index}) => {
    const classes = useStyles();

    const getSatName = () => {
        return ((satellite && satellite.names && satellite.names.length > 0) ? satellite.names[0].names : "Name not found...");
    };
    const getSatImage = () => {
        return ((satellite && satellite.images && satellite.images.length > 0) ? satellite.images[0].link : "/sat-placeholder.jpg");
    }
    const getSatID = () => {
        return ((satellite && satellite.noradID) ? satellite.noradID : "NORAD ID not found...");
    }
    const getSatDesc = () => {
        return ((satellite && satellite.descriptionShort && satellite.descriptionShort.length > 0) ? satellite.descriptionShort[0].descriptionShort : "")
    }
    return(
        <Card className={classes.satCard}>
            <CardMedia 
                className={classes.image}
                image={getSatImage()}
                title="Satellite image"
            />
            <CardContent>
                <Typography variant="h5" component="h2">
                    {getSatName()}
                </Typography>
                <Typography gutterBottom variant="button" component="p">
                    {getSatID()}
                </Typography>
                <Typography 
                    className={classes.description}
                    variant="body2" 
                    color="textSecondary" 
                    component="p"
                >
                    <Clamp lines={7}>{getSatDesc()}</Clamp>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">
                    Visualise
                </Button>
                <Button size="small">
                    View more
                </Button>
            </CardActions>
        </Card>
    );
};
