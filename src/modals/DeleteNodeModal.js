import React, { useEffect, useState } from "react";
import { deleteNode } from "../util/graphUtils";
import CustomModal from "../components/modal/CustomModal";
import ModalAction from "../components/modal/ModalAction";
import Label from "../components/Label";

const DeleteNodeModal = ({
  deleteModalOpen,
  setDeleteModalOpen,
  setOrigNodes,
  origNodes,
  origLinks,
  setOrigLinks,
}) => {
  const [nodeId, setNodeId] = useState("");
  const [nodeDD, setNodeDD] = useState([]);

  const onClose = () => {
    setNodeId("");
    setDeleteModalOpen((prevState) => !prevState);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (nodeId === "") return;
    deleteNode(
      parseInt(nodeId),
      origNodes,
      setOrigNodes,
      origLinks,
      setOrigLinks
    );
    setDeleteModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (localStorage.getItem("nodes") !== null) {
      let nodes = JSON.parse(localStorage.getItem("nodes"));
      let filteredNodes = nodes.filter((node) => node.parent === undefined);
      setNodeDD([
        { id: "", label: "Select a node" },
        ...filteredNodes.map((node) => {
          return { id: node.id, label: node.label };
        }),
      ]);
    }
  }, [JSON.stringify(localStorage.getItem("nodes"))]);

  return (
    <>
      <CustomModal
        isOpen={deleteModalOpen}
        onClose={onClose}
        contentLabel={"Delete Node"}
        modalTitle={"Delete Node"}
        onSubmit={onSubmit}
        modalMessage={`Select a node by name to delete the node. 
        <br />
        <br />
        This is not reversible and will also delete all its associated
        children and links.`}
      >
        <Label title="Node" />
        <select
          name="node_list"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
        >
          {nodeDD &&
            nodeDD.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
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

export default DeleteNodeModal;
