import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { SchemaFormField } from './SchemaFormField';

export const SchemaForm = ({name, desc, fields, createNewField, handleNameChange, handleDescChange, handleFieldChange, editing}) => {
  return (
    <Form>
      <Form.Row>
        <Col>
          <Form.Control disabled={!editing} onChange={handleNameChange} value={name} placeholder="Schema name" />
        </Col>
      </Form.Row>
      <Form.Row className="mt-3">
        <Col>
          <Form.Control disabled={!editing} as="textarea" onChange={handleDescChange} value={desc} placeholder="Schema description" />
        </Col>
      </Form.Row>
      {fields.map((field, index) => {
        return (
          <SchemaFormField editing={editing} key={`field-${index}`} className="mt-3" index={index} field={field} handleFieldChange={handleFieldChange}/>
        )
      })}
      {editing && <Button className="mt-3" variant="outline-dark" onClick={createNewField}>Add new field</Button>}
    </Form>
  )
};
