import React from 'react';
import { Card, Col, Row, Button, Accordion, Carousel} from 'react-bootstrap';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import {Modal} from 'react-bootstrap';

let missingSatImage = "https://i.stack.imgur.com/y9DpT.jpg";

export const SatCard = ({Satellite}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const showModal = () => {
    setIsOpen(true);
    };

    const hideModal = () => {
    setIsOpen(false);
    };

    let satName = ()=>{
        return ((Satellite && Satellite.names && Satellite.names.length>0) ? Satellite.names[0].names : "");
    };

    let getDataKeys = ()=>{
        return Object.keys(Satellite);
    }

    let getValues = (key)=>{
        return (Array.isArray(Satellite[key])) ? Satellite[key] : [];
    }
    let getImages = ()=>{
        return (Array.isArray(Satellite["images"])) ? Satellite["images"] : [{link:missingSatImage}];
    }
    return(
    <>
        <Card border="secondary" style={{ width: "18rem", minWidth:"18rem"}} className="mt-5">
            <Card.Img variant="top" src={(Satellite && Satellite.images && Satellite.images.length>0) ? Satellite.images[0].link : missingSatImage} />
            <Card.Body>
                <Card.Title className="text-center">
                    <div className="cardName">{satName()}</div>
                    <div>{(Satellite && Satellite.noradID) ? Satellite.noradID : "Unknown"}</div>
                </Card.Title>
                <Card.Text className="cardShortDescription">
                    {(Satellite && Satellite.descriptionShort && Satellite.descriptionShort.length>0) ? Satellite.descriptionShort[0].descriptionShort : "No description found.."}
                </Card.Text>
            </Card.Body>
            <Card.Body className="text-center">
                <Row>
                    <Col><Card.Link href="#" onClick={showModal}>View Card</Card.Link></Col>
                    <Col><Card.Link href="#">Visualize</Card.Link></Col>
                </Row>
            </Card.Body>
        </Card>
  
        <Modal show={isOpen} onHide={hideModal}>
            <Modal.Header>
                <h3>{satName()}</h3>
                <p>{Satellite.noradID}</p>
            </Modal.Header>
            <Modal.Body>
                <Carousel>
                {
                    getImages().map( (image,index)=>{
                        return(
                            <Carousel.Item >
                                <img
                                    className="d-block w-100"
                                    src={image.link}
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        )
                    })
                }

                </Carousel>

                <Accordion>
                {
                    getDataKeys().map((key, index) =>{
                        if(getValues(key).length>0){
                            return(
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                                    {key}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={index}>
                                    <Card.Body>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                <th scope="col"></th>
                                                <th scope="col">Reference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    getValues(key).map( (value,valIndex)=>{
                                                        return(
                                                            <tr eventKey={valIndex}>
                                                                <td>{JSON.stringify(value[key])}</td>
                                                                <td>{value["reference"]}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            );
                        }
                        
                    })
                }
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
    );
};
