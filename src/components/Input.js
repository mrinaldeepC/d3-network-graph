import React from "react";

const Input = ({ value, name, maxLength, onChange }) => {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
    />
  );
};

export default Input;
