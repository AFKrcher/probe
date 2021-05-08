import React from 'react';
import Container from "react-bootstrap/container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

export const About = () => (
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
  );