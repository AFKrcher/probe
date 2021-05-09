import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { SchemaForm } from '../SchemaModal/SchemaForm';
import { SchemaCollection } from '../../api/schema';

const createOption = (label) => ({
  label,
  value: label,
});

const capitalise = (string) => {
  return string.substring(0,1).toUpperCase() + string.substring(1);
}

export const SchemaEditModal = ({ editSchema, show, handleClose }) => {
  // Store the current form values in the state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [fields, setFields] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    console.log(editSchema);
    if (editSchema !== null && editSchema !== undefined) {
      setName(editSchema.name);
      setDesc(editSchema.description);
      setFields(editSchema.fields.map((field) => ({
        name: field.name,
        type: {value: field.type, label: capitalise(field.type)},
        allowed: field.allowed.map((allowed) => ({value: allowed, label: capitalise(allowed)}))
      })));
    }
  }, [editSchema]);

  const closeModal = () => {
    setName("");
    setDesc("");
    setFields([]);
    setEditing(false);
    handleClose();
  }

  const handleEditCancel = () => {
    setName(editSchema.name);
    setDesc(editSchema.description);
    setFields(editSchema.fields.map((field) => ({
      name: field.name,
      type: {value: field.type, label: capitalise(field.type)},
      allowed: field.allowed.map((allowed) => ({value: allowed, label: capitalise(allowed)}))
    })));
    setEditing(false);
  } 

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

    console.group("Submitting data");
    console.log(name);
    console.log(desc);
    console.log(fields);
    console.groupEnd();

    schemaObject.name = name.toLowerCase();
    schemaObject.description = desc;
    schemaObject.fields = fields.map((field) => ({
      name: field.name.toLowerCase(),
      type: field.type.value,
      allowed: field.allowed.map((allowed) => allowed.value)
    }));
    SchemaCollection.update({name: editSchema.name}, schemaObject);
    handleClose();
  }

  return(
    <Modal show={show} onHide={closeModal} >
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit schema" : "View schema"}</Modal.Title>
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
            editing={editing}
          />
        </Modal.Body>
        <Modal.Footer>
          {
            editing ? 
            <Button className="align-self-start" variant="outline-danger" onClick={handleEditCancel}>Cancel Editing</Button>
            :
            <Button className="align-self-start" variant="outline-danger" onClick={() => setEditing(true)}>Enable Editing</Button>
          }
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          {
            editing &&
            <Button variant="success" onClick={handleSubmit}>Save Schema</Button>
          }
        </Modal.Footer>
    </Modal>
  )
};
