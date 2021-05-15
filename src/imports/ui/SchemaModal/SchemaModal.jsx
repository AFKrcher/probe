import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SchemaForm } from './SchemaForm';
import { SchemaCollection } from '../../api/schema';

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaModal = ({ show, handleClose }) => {
  // Store the current form values in the state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (show === false) {
      setName("");
      setDesc("");
      setFields([]);
    }
  }, [show]);

  const createNewField = () => {
    setFields([...fields, {name: "", type: "", allowed: []}]); 
  }

  const handleNameChange = (event) => {
    setName(event.currentTarget.value);
  }

  const handleDescChange = (event) => {
    setDesc(event.currentTarget.value);
  }

  const handleFieldChange = (newField, index) => {
    const updated = fields.slice();
    updated[index] = newField;
    setFields(updated);
  }

  const handleSubmit = () => {
    const schemaObject = {};
    schemaObject.name = name;
    schemaObject.description = desc;
    schemaObject.fields = [
      {
        name: "reference",
        type: "string",
        allowedValues: []
      },
      ...fields.map((field) => ({
        name: field.name.toLowerCase(),
        type: field.type.value,
        allowed: field.allowedValues.map((allowed) => allowed.value)
      }))
    ];
    console.log(JSON.stringify(schemaObject));
    SchemaCollection.insert(schemaObject);
    handleClose();
  }

  return(
    <Modal show={show} onHide={handleClose} >
        <Modal.Header>
          <Modal.Title>Create a new schema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SchemaForm
            name={name} 
            desc={desc}
            fields={fields}
            createNewField={createNewField}
            handleNameChange={handleNameChange}
            handleDescChange={handleDescChange}
            handleFieldChange={handleFieldChange}
            editing={false}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="success" onClick={handleSubmit}>Save Schema</Button>
        </Modal.Footer>
    </Modal>
  )
};
