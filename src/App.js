import React, { useEffect, useState } from "react";
import "./App.css";
import NetworkGraph from "./graphs/NetworkGraph";
import nodesData from "./nodes_data.json";
import linksData from "./links_data.json";
import { addNode } from "./util/graphUtils";
import Modal from "react-modal";
import AddNodesModal from "./modals/AddNodesModal";
import DeleteNodeModal from "./modals/DeleteNodeModal";
import PrimaryButton from "./components/PrimaryButton";
import AddLinkModal from "./modals/AddLinkModal";
import DeleteLinkModal from "./modals/DeleteLinkModal";
import DeleteButton from "./components/DeleteButton";

Modal.setAppElement("#root");

function App() {
  const [nodes, setNodes] = useState(null);
  const [links, setLinks] = useState(null);
  const [origNodes, setOrigNodes] = useState(nodesData);
  const [origLinks, setOrigLinks] = useState(linksData);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLinkModalOpen, setDeleteLinkModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("nodes") === null) {
      localStorage.setItem("nodes", JSON.stringify(origNodes));
      localStorage.setItem("links", JSON.stringify(origLinks));
      setNodes(origNodes);
      setLinks(origLinks);
    } else {
      setOrigNodes(JSON.parse(localStorage.getItem("nodes")));
      setNodes(JSON.parse(localStorage.getItem("nodes")));
      setOrigLinks(JSON.parse(localStorage.getItem("links")));
      setLinks(JSON.parse(localStorage.getItem("links")));
    }
  }, [
    JSON.stringify(localStorage.getItem("nodes")),
    JSON.stringify(localStorage.getItem("links")),
  ]);

  return (
    <React.Fragment>
      <div className="addBtnWrapper">
        <PrimaryButton
          title={"Add Node"}
          onClick={() => setAddModalOpen((prevState) => !prevState)}
          type={"button"}
        />
        <DeleteButton
          title={"Delete Node"}
          onClick={() => setDeleteModalOpen((prevState) => !prevState)}
          type={"button"}
        />
        <PrimaryButton
          title={"Add Link"}
          onClick={() => setAddLinkModalOpen((prevState) => !prevState)}
          type={"button"}
        />
        <DeleteButton
          title={"Delete Link"}
          onClick={() => setDeleteLinkModalOpen((prevState) => !prevState)}
          type={"button"}
        />
      </div>
      <NetworkGraph
        nodes={nodes}
        links={links}
        setNodes={setOrigNodes}
        setLinks={setOrigLinks}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <AddNodesModal
        addModalOpen={addModalOpen}
        setAddModalOpen={setAddModalOpen}
        setOrigNodes={setOrigNodes}
        origNodes={origNodes}
        setOrigLinks={setOrigLinks}
        key={"add_node"}
      />

      <DeleteNodeModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setOrigNodes={setOrigNodes}
        origNodes={origNodes}
        origLinks={origLinks}
        setOrigLinks={setOrigLinks}
        key={"delete_node_particular"}
      />

      <DeleteLinkModal
        deleteModalOpen={deleteLinkModalOpen}
        setDeleteModalOpen={setDeleteLinkModalOpen}
        setOrigLinks={setOrigLinks}
        origLinks={origLinks}
        key={"delete_link_btn_click"}
      />

      <AddLinkModal
        addLinkModalOpen={addLinkModalOpen}
        origNodes={origNodes}
        origLinks={origLinks}
        setAddLinkModalOpen={setAddLinkModalOpen}
        setOrigNodes={setOrigNodes}
        setOrigLinks={setOrigLinks}
        key={"add_link"}
      />
    </React.Fragment>
  );
}

export default App;
