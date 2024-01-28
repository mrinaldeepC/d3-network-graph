import React, { Children } from "react";

const ModalBody = ({ onSubmit, children }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default ModalBody;
