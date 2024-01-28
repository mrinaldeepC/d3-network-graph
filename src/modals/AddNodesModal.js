import React, { useState } from "react";
import { addNode } from "../util/graphUtils";
import Input from "../components/Input";
import Label from "../components/Label";
import ModalAction from "../components/modal/ModalAction";
import CustomModal from "../components/modal/CustomModal";

const AddNodesModal = ({
  addModalOpen,
  setAddModalOpen,
  setOrigNodes,
  origNodes,
}) => {
  const [nodeName, setNodeName] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    addNode(nodeName, origNodes, setOrigNodes);
    setNodeName("");
    setAddModalOpen((prevState) => !prevState);
  };

  return (
    <CustomModal
      isOpen={addModalOpen}
      onClose={() => setAddModalOpen((prevState) => !prevState)}
      contentLabel={"Add Node"}
      modalTitle={"Add Node"}
      onSubmit={onSubmit}
      modalMessage={
        "If node name is not entered the node will be provided a default name"
      }
    >
      <Label title={"Node Name"} />
      <Input
        name={"node_name"}
        value={nodeName}
        maxLength={10}
        onChange={(e) => setNodeName(e.target.value)}
      />
      <ModalAction
        showCancel={true}
        showSubmit={true}
        submitTitle={"Save"}
        cancelTitle={"Cancel"}
        onCancelClick={() => setAddModalOpen((prevState) => !prevState)}
        marginTop="0px"
      />
    </CustomModal>
  );
};

export default AddNodesModal;
