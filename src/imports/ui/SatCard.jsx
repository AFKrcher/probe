import React from 'react';
import Container from "react-bootstrap/container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";



export const SatCard = (Satellite) => (

    <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src="https://dl.airtable.com/.attachments/bf350cd85a641b9c9c0bf7a58177f484/399d5e1d/AeroCube-10A_2.png" />
    <Card.Body>
        <Card.Title className="text-center">
            <div className="cardName">{Satellite.name}</div>
            <div>{Satellite.NoradID}</div>
        </Card.Title>
        <Card.Text>
        <p className="cardShortDescription">
            {Satellite.shortDescription}
        </p>
        </Card.Text>
    </Card.Body>
    <Card.Body className="text-center">
        <Row>
            <Col><Card.Link href="#">View Card</Card.Link></Col>
            <Col><Card.Link href="#">Visualize</Card.Link></Col>
        </Row>
    </Card.Body>
    </Card>

);