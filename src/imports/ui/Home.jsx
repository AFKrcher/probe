import React from 'react';
import { Link } from "react-router-dom";
import { SatCard } from "./SatCard.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';
import { Col, Row, Button, Jumbotron, Container} from 'react-bootstrap';


export const Home = () => {
    const demoSats = useTracker(() => {
        return SatelliteCollection.find().fetch(4);
    });

    return(
        <>
            <Container fluid className="py-5"> 
                <Jumbotron>
                    <h1>Welcome to SpaceIntel!</h1>
                    <p>
                        SpaceIntel is seeking to become the world's most complete and easy to use resource for spacecraft data and information.
                    </p>
                    <p>
                        100% Open Source, 100% Machine Readable.
                    </p>
                    <p>
                    <Link to="/satellites">
                        <Button variant="primary">Check it out</Button>
                    </Link>


                    </p>
                </Jumbotron>
            </Container>

            
            <Row className="m-2">
                <h1 className="pl-4">Some example data</h1>
                {
                    //Take 8 for a demo
                    demoSats.slice(0,8).map((s, index) =>{
                        return ( 
                            <Col sm="6" md="5" lg="4" xl="3" key={index}>
                                <SatCard Satellite={s} key={index} />
                            </Col>
                        )
                    })
                }
            </Row>

        </>
    );
};