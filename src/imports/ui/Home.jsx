import React from 'react';
import Container from "react-bootstrap/container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { SatCard } from "./SatCard.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const Home = () => {
    const demoSats = useTracker(() => {
        return SatelliteCollection.find().fetch(4);
    });

    return(
        <>
            <Container fluid className="pt-4"> 
                <Jumbotron>
                    <h1>Welcome to SpaceIntel!</h1>
                    <p>
                        SpaceIntel is seeking to become the world's most complete and easy to use resource for spacecraft data and information.
                    </p>
                    <p>
                        100% Open Source, 100% Machine Readable.
                    </p>
                    <p>
                        <Button variant="primary">Check it out</Button>
                    </p>
                </Jumbotron>
            </Container>

            <Container fluid className="pt-4">
                {
                    demoSats.map(s=>{
                    return (
                        <Row>
                            <Col>
                                <SatCard Satellite={s} />
                            </Col>
                        </Row>
                    )
                    })
                }
            </Container>
        </>
    );
};