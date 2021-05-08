import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Select from 'react-select';
import { MultiSelectTextInput } from './MultiSelectTextInput';
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
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [fields, setFields] = useState([])

  const [inputText, setInputText] = useState("");
  const [value, setValue] = useState([]);

  const createNewField = () => {}

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
    <Form>
      {fields.map((field) => {
        return (
          <SchemaFormField name={field.name} type={field.type} allowed={field.allowed} />
        )
      })}
    </Form>
  )
};
