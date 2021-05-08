import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Select from 'react-select';
import { MultiSelectTextInput } from './MultiSelectTextInput';

const typeOptions = [
  {value: "number", label: "Number"},
  {value: "string", label: "String"}
]

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaFormField = (  ) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("")
  const [inputText, setInputText] = useState("");
  const [value, setValue] = useState([]);

  const handleNameChange = (event) => {
    setName(event.currentTarget.value);
  }

  const handleChange = (value, actionMeta) => {
    setValue(value);
  }

  const handleInputChange = (inputText) => {
    setInputText(inputText);
  }

  const handleKeyDown = (event) => {
    if (!inputText) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue([...value, createOption(inputText)]);
        setInputText("");
        event.preventDefault();
    }
  }
  
  return (
    <>
      <Form.Row>
        <Col>
          <Form.Control onChange={handleNameChange} placeholder="Field" />
        </Col>
        <Col>
          <Select 
            options={typeOptions}
            placeholder="Data type"
          />
        </Col>
      </Form.Row>
      <Form.Row className="pt-2">
        <Col>
          <MultiSelectTextInput 
            inputText={inputText} 
            value={value}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
          />
        </Col>
      </Form.Row>
    </>
  )
};
