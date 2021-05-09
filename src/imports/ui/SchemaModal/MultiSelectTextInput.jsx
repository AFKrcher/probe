import React from 'react';
import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

export const MultiSelectTextInput = ( props ) => {
  return (
    <CreatableSelect 
      components={components}
      inputValue={props.inputText}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={props.handleChange}
      onInputChange={props.handleInputChange}
      onKeyDown={props.handleKeyDown}
      placeholder="Allowed values (type a value and press Enter)"
      value={props.value}
    />
  )
};