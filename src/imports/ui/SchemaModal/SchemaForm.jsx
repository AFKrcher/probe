import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { SchemaFormField } from './SchemaFormField';

const typeOptions = [
  {value: "number", label: "Number"},
  {value: "string", label: "String"}
]

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaForm = () => {
  // Store the current form values in the state
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [fields, setFields] = useState([])

  // 
  const [inputText, setInputText] = useState("");
  const [value, setValue] = useState([]);

  const createNewField = () => {
    setFields([...fields, {name: "", type: "", allowed: []}]); 
  }

  const handleNameChange = (event) => {
    setName(event.currentTarget.value);
  }

  const handleRefChange = (event) => {
    setRef(event.currentTarget.value);
  } 

  const handleFieldChange = (newField, index) => {
    const updated = fields;
    updated[index] = newField;
    setFields(updated);
  }
  
  return (
    <Form>
      <Form.Row >
        <Col>
          <Form.Control onChange={handleNameChange} value={name} placeholder="Schema name" />
        </Col>
      </Form.Row>
      <Form.Row className="mt-3">
        <Col>
          <Form.Control onChange={handleRefChange} value={ref} placeholder="Reference URL" />
        </Col>
      </Form.Row>
      {fields.map((field, index) => {
        return (
          <SchemaFormField className="mt-3" index={index} field={field} handleFieldChange={handleFieldChange}/>
        )
      })}
      <Button className="mt-3" variant="outline-dark" onClick={createNewField}>Add new field</Button>
    </Form>
  )
};
