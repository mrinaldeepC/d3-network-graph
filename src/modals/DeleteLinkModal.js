import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { deleteLink } from "../util/graphUtils";
import CustomModal from "../components/modal/CustomModal";
import ModalAction from "../components/modal/ModalAction";
import ModalBody from "../components/modal/ModalBody";
import Label from "../components/Label";

const DeleteLinkModal = ({
  deleteModalOpen,
  setDeleteModalOpen,
  setOrigLinks,
  origLinks,
}) => {
  const [linkDD, setLinkDD] = useState([]);
  const [linkId, setLinkId] = useState("");
  const onClose = () => {
    setDeleteModalOpen((prevState) => !prevState);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (linkId === "") return;
    deleteLink(parseInt(linkId), setOrigLinks);
    setDeleteModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (localStorage.getItem("links") !== null) {
      let links = JSON.parse(localStorage.getItem("links"));
      setLinkDD([
        { id: "", label: "Select a link" },
        ...links.map((link) => {
          return { id: link.id, label: link.label };
        }),
      ]);
    }
  }, [JSON.stringify(localStorage.getItem("links"))]);

  return (
    <>
      <CustomModal
        isOpen={deleteModalOpen}
        onClose={onClose}
        contentLabel={"Delete Link"}
        modalTitle={"Delete Link"}
        onSubmit={onSubmit}
        modalMessage={`Select a link by name to delete the link. This is not reversible.`}
      >
        <Label title="Link" />
        <select
          name="target_list"
          value={linkId}
          onChange={(e) => setLinkId(e.target.value)}
        >
          {linkDD &&
            linkDD.map((link) => (
              <option key={link.id} value={link.id}>
                {link.label}
              </option>
            ))}
        </select>
        <ModalAction
          showCancel={true}
          showSubmit={true}
          submitTitle={"Delete"}
          cancelTitle={"Cancel"}
          onCancelClick={onClose}
          marginTop="10px"
        />
      </CustomModal>
    </>
  );
};

export default DeleteLinkModal;
