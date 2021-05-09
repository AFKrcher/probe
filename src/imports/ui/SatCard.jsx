import React from 'react';
import Container from "react-bootstrap/container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


let missingSatImage = "https://newsroom.haas.berkeley.edu/wp-content/uploads/2019/05/Satellite_Panos-Patatoukas-research.jpg";

export const SatCard = ({Satellite}) => (
    <Card style={{ width: "18rem", minWidth:"8rem"}} className="m-2">
    <Card.Img variant="top" src={(Satellite && Satellite.images && Satellite.images.length>0) ? Satellite.images[0].link : missingSatImage} />
    <Card.Body>
        <Card.Title className="text-center">
            <div className="cardName">{(Satellite && Satellite.names.length>0) ? Satellite.names[0].names : ""}</div>
            <div>{(Satellite && Satellite.noradID) ? Satellite.noradID : "Unknown"}</div>
        </Card.Title>
        <Card.Text>
        <p className="cardShortDescription">
            {(Satellite && Satellite.descriptionShort && Satellite.descriptionShort.length>0) ? Satellite.descriptionShort[0].descriptionShort : "No description found.."}
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
