import React from "react";
import Select from "react-select";
import { languageOptions } from "../constants/languageOptions";
import { customStyles } from "../constants/customStyles";

const LanguagesDropdown = ({ onSelectChange }) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
      styles={customStyles}
    />
  );
};

export default LanguagesDropdown;
