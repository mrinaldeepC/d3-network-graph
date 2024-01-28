import React from "react";

const PrimaryButton = ({ title, onClick, type }) => {
  return (
    <button
      className="primary"
      type={type}
      onClick={() => (type === "button" ? onClick() : null)}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
