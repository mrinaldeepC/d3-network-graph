import React, { useEffect, useState } from "react";
import { addLink, getAvailableLinks } from "../util/graphUtils";
import Input from "../components/Input";
import Label from "../components/Label";
import ModalAction from "../components/modal/ModalAction";
import CustomModal from "../components/modal/CustomModal";

const AddLinkModal = ({
  addLinkModalOpen,
  setAddLinkModalOpen,
  setOrigNodes,
  origNodes,
  origLinks,
  setOrigLinks,
}) => {
  const [sourceDD, setSourceDD] = useState([]);
  const [targetDD, setTargetDD] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [linkName, setLinkName] = useState("");
  const [error, setError] = useState({
    hasErr: false,
    errMsg: "",
  });

  const onChangeSource = (e) => {
    setError({
      hasErr: false,
      errMsg: "",
    });
    setSelectedSource(e.target.value);
    setSelectedTarget("");
    let targets = [{ id: "", label: "Select a target node" }];
    setTargetDD([...targets]);
    if (e.target.value !== "") {
      let availableLinkIds = getAvailableLinks(
        parseInt(e.target.value),
        origLinks,
        origNodes
      );
      setTargetDD([...targets, ...availableLinkIds]);
    } else {
      setTargetDD([...targets]);
    }
  };

  const onChangeTarget = (e) => {
    setSelectedTarget(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("nodes") !== null) {
      let nodes = JSON.parse(localStorage.getItem("nodes"));
      let sources = [{ id: "", label: "Select a source node" }];
      setSourceDD(() => [...sources, ...nodes.filter((node) => !node.hidden)]);
      let targets = [{ id: "", label: "Select a target node" }];
      setTargetDD(targets);
    }
  }, [JSON.stringify(localStorage.getItem("nodes"))]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedTarget === "" || selectedSource === "") {
      setError({
        hasErr: true,
        errMsg:
          selectedTarget === "" && selectedSource === ""
            ? "Please select source & target node"
            : selectedSource === ""
            ? "Please select a source node"
            : "Please select a target node",
      });
      return;
    }
    addLink(
      linkName,
      parseInt(selectedSource),
      parseInt(selectedTarget),
      origNodes,
      setOrigNodes,
      origLinks,
      setOrigLinks
    );
    setLinkName("");
    setSelectedSource("");
    setSelectedTarget("");
    setError({ hasErr: false, errMsg: "" });
    setAddLinkModalOpen((prevState) => !prevState);
  };

  const onClose = () => {
    setLinkName("");
    setSelectedSource("");
    setSelectedTarget("");
    setError({ hasErr: false, errMsg: "" });
    setAddLinkModalOpen((prevState) => !prevState);
  };

  return (
    <CustomModal
      isOpen={addLinkModalOpen}
      onClose={onClose}
      contentLabel={"Add Link"}
      modalTitle={"Add Link"}
      onSubmit={onSubmit}
      modalMessage={
        "If link name is not entered the link will be provided a default name"
      }
    >
      {error.hasErr && (
        <p style={{ fontSize: "10px", color: "red" }}>{error.errMsg}</p>
      )}
      <Label title={"Link Name"} />
      <Input
        name={"link_name"}
        value={linkName}
        maxLength={10}
        onChange={(e) => setLinkName(e.target.value)}
      />
      <Label title={"Source"} />
      <select
        name="source_list"
        value={selectedSource}
        onChange={onChangeSource}
      >
        {sourceDD &&
          sourceDD.map((source) => (
            <option key={source.id} value={source.id}>
              {source.label}
            </option>
          ))}
      </select>
      <Label title={"Target"} />
      <select
        name="target_list"
        value={selectedTarget}
        onChange={onChangeTarget}
      >
        {targetDD &&
          targetDD.map((target) => (
            <option key={target.id} value={target.id}>
              {target.label}
            </option>
          ))}
      </select>
      <ModalAction
        showCancel={true}
        showSubmit={true}
        submitTitle={"Save"}
        cancelTitle={"Cancel"}
        onCancelClick={onClose}
        marginTop="0px"
      />
    </CustomModal>
  );
};

export default AddLinkModal;
