import React from "react";

const LinkButton = ({ title, onClick }) => {
  return (
    <button className="link" onClick={onClick} type="button">
      {title}
    </button>
  );
};

export default LinkButton;
