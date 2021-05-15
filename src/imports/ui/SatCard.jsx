import React from 'react';
import { Card, Col, Row, Button, Accordion} from 'react-bootstrap';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import {Modal} from 'react-bootstrap';

let missingSatImage = "https://newsroom.haas.berkeley.edu/wp-content/uploads/2019/05/Satellite_Panos-Patatoukas-research.jpg";

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
  
        <Modal show={isOpen} onHide={hideModal} dialogClassName="modal-90w">
            <Modal.Header>{satName()}</Modal.Header>
            <Modal.Body>
            <Accordion>
                {
                    getDataKeys().map((key, index) =>{
                        return(
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey={index}>
                                {key}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={index}>
                                <Card.Body>
  
                                    <table class="table">
                                        <thead>
                                            <tr>
                                            <th scope="col">Reference</th>
                                            <th scope="col">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                getValues(key).map( (value,valIndex)=>{
                                                    return(
                                                        <tr eventKey={valIndex}>
                                                            <td>{value["reference"]}</td>
                                                            <td>{JSON.stringify(value[key])}</td>
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
