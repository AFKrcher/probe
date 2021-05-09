import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SchemaForm } from './SchemaForm';

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaModal = ({ show, handleClose }) => {
  // Store the current form values in the state
  const [name, setName] = useState("");
  const [fields, setFields] = useState([]);

  const createNewField = () => {
    setFields([...fields, {name: "", type: "", allowed: []}]); 
  }

  const handleNameChange = (event) => {
    setName(event.currentTarget.value);
  }

  const handleFieldChange = (newField, index) => {
    const updated = fields.slice();
    updated[index] = newField;
    setFields(updated);
  }

  const handleSubmit = () => {
    const schemaObject = {};
    schemaObject.name = name;
    schemaObject.fields = [
      {
        name: "reference",
        type: "string",
        allowed: []
      },
      ...fields.map((field) => ({
        name: field.name.toLowerCase(),
        type: field.type.value,
        allowed: field.allowed.map((allowed) => allowed.value)
      }))
    ];
    console.log(schemaObject);
    handleClose();
  }

  return(
    <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Create a new schema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SchemaForm
            name={name} 
            fields={fields}
            createNewField={createNewField}
            handleNameChange={handleNameChange}
            handleFieldChange={handleFieldChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="success" onClick={handleSubmit}>Save Schema</Button>
        </Modal.Footer>
    </Modal>
  )
};
