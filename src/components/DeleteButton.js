import React from "react";

const DeleteButton = ({ title, onClick, type }) => {
  return (
    <button
      className="danger"
      type={type}
      onClick={() => (type === "button" ? onClick() : null)}
    >
      {title}
    </button>
  );
};

export default DeleteButton;
