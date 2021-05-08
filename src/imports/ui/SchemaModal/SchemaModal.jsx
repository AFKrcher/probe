import React from 'react';
import { Modal } from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap/Button';

export const SchemaModal = ({ show, handleClose }) => (
  <Modal>
      <Modal.Header closeButton>
        <Modal.Title>Create a new schema</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are creating a new schema right now!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleClose}>Save Schema</Button>
      </Modal.Footer>
  </Modal>
);
