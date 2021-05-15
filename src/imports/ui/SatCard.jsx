import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Flippy, { FrontSide, BackSide } from 'react-flippy';

let missingSatImage = "https://newsroom.haas.berkeley.edu/wp-content/uploads/2019/05/Satellite_Panos-Patatoukas-research.jpg";

export const SatCard = ({Satellite}) => (
    <>
    <Flippy
        flipOnHover={false} // default false
        flipOnClick={true} // default false
        flipDirection="horizontal" // horizontal or vertical
        ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
        // if you pass isFlipped prop component will be controlled component.
        // and other props, which will go to div
        style={{ width: "18rem", minWidth:"18rem" }}
    >
        <FrontSide>
            <Card border="secondary" style={{ width: "18rem", minWidth:"18rem"}} className="mt-5">
                <Card.Img variant="top" src={(Satellite && Satellite.images && Satellite.images.length>0) ? Satellite.images[0].link : missingSatImage} />
                <Card.Body>
                    <Card.Title className="text-center">
                        <div className="cardName">{(Satellite && Satellite.names && Satellite.names.length>0) ? Satellite.names[0].names : ""}</div>
                        <div>{(Satellite && Satellite.noradID) ? Satellite.noradID : "Unknown"}</div>
                    </Card.Title>
                    <Card.Text className="cardShortDescription">
                        {(Satellite && Satellite.descriptionShort && Satellite.descriptionShort.length>0) ? Satellite.descriptionShort[0].descriptionShort : "No description found.."}
                    </Card.Text>
                </Card.Body>
                <Card.Body className="text-center">
                    <Row>
                        <Col><Card.Link href="#">View Card</Card.Link></Col>
                        <Col><Card.Link href="#">Visualize</Card.Link></Col>
                    </Row>
                </Card.Body>
            </Card>
        </FrontSide>
        <BackSide>
            Back Side
        </BackSide>
    </Flippy>

    
    </>
);
