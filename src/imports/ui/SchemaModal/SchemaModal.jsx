import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SchemaForm } from './SchemaForm';

export const SchemaModal = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Create a new schema</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SchemaForm />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="success" onClick={handleClose}>Save Schema</Button>
      </Modal.Footer>
  </Modal>
);
