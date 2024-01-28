import React, { useEffect, useState } from "react";
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
  setOrigLinks,
}) => {
  const [nodeName, setNodeName] = useState("");
  const [isChildNode, setIsChildNode] = useState(false);
  const [selectedParent, setSelectedParent] = useState("");
  const [nodesDD, setNodesDD] = useState([]);
  const [error, setError] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (isChildNode && selectedParent === "") {
      setError(true);
      return;
    }
    addNode(nodeName, selectedParent, origNodes, setOrigNodes, setOrigLinks);
    setNodeName("");
    setSelectedParent("");
    setIsChildNode(false);
    setAddModalOpen((prevState) => !prevState);
  };

  const onChangeIsChildNode = (e) => {
    console.log(e.target.checked);
    setError(false);
    setIsChildNode(e.target.checked);
  };

  useEffect(() => {
    if (localStorage.getItem("nodes") !== null) {
      let nodes = JSON.parse(localStorage.getItem("nodes"));
      setNodesDD([
        { id: "", label: "Select a parent" },
        ...nodes.map((node) => {
          return { id: node.id, label: node.label };
        }),
      ]);
    }
  }, [JSON.stringify(localStorage.getItem("nodes"))]);

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
      {error && (
        <p style={{ fontSize: "10px", color: "red" }}>Please select a parent</p>
      )}
      <Label title={"Node Name"} />
      <Input
        name={"node_name"}
        value={nodeName}
        maxLength={10}
        onChange={(e) => setNodeName(e.target.value)}
      />

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <input
          id="isChildCheckbox"
          value={isChildNode}
          type="checkbox"
          onChange={onChangeIsChildNode}
          style={{ margin: 0, marginRight: "10px" }}
        />
        <label htmlFor={"isChildCheckbox"}> Is Child Node ? </label>
      </div>
      {isChildNode && (
        <>
          <Label title={"Parent"} />
          <select
            value={selectedParent}
            onChange={(e) => {
              setError(false);
              setSelectedParent(e.target.value);
            }}
          >
            {nodesDD &&
              nodesDD.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
          </select>
        </>
      )}
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
