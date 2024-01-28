import React from "react";
import Modal from "react-modal";
import ModalTitle from "./ModalTitle";
import ModalBody from "./ModalBody";
import FormInfo from "../FormInfo";

import customStyles from "./customStyles";

const CustomModal = ({
  isOpen,
  onClose,
  contentLabel,
  modalTitle,
  onSubmit,
  modalMessage,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => null}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={contentLabel}
    >
      <ModalTitle title={modalTitle} />
      <ModalBody onSubmit={onSubmit}>
        <FormInfo message={modalMessage} />
        {children}
      </ModalBody>
    </Modal>
  );
};

export default CustomModal;
