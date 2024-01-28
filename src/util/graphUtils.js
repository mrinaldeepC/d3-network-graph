const updateLocalStorage = (nodes, links) => {
  if (nodes !== null) localStorage.setItem("nodes", JSON.stringify(nodes));
  if (links !== null) localStorage.setItem("links", JSON.stringify(links));
};

const addNode = (nodeName, selectedParent, origNodes, setOrigNodes) => {
  const nextId = origNodes[origNodes.length - 1].id + 1;
  let defaultName = "";
  if (nodeName === "") {
    if (selectedParent === "") {
      const ids = origNodes.map((node) => {
        return node.parent === undefined && node.id;
      });
      defaultName = `Node ${Math.max(...ids) + 1}`;
    } else {
      defaultName = `Node ${nextId}`;
    }
  }
  let parentObj = [
    {
      id: "",
    },
  ];
  let nodeObj = {
    id: nextId,
    label: nodeName !== "" ? nodeName : defaultName,
    color: "black",
    font: {
      color: "white",
    },
    hidden: false,
  };
  let links = JSON.parse(localStorage.getItem("links"));
  let modifiedLinks = [...links];
  if (selectedParent !== "") {
    parentObj[0].id = parseInt(selectedParent);
    nodeObj.parent = parentObj;
    let parentNode = origNodes.filter(
      (node) => node.id === parseInt(selectedParent)
    )[0];
    nodeObj.hidden = parentNode.hidden;
    let nextLinkId = 0;
    if (links !== null) {
      nextLinkId = links[links.length - 1].id + 1;
    }
    let link = {
      source: parseInt(selectedParent),
      target: nextId,
      hidden: parentNode.hidden,
      label: `Link ${nextLinkId}`,
      id: nextLinkId,
    };

    modifiedLinks.push(link);
  }
  let modifiedNodes = [...origNodes, nodeObj];
  setOrigNodes(modifiedNodes);
  updateLocalStorage(modifiedNodes, modifiedLinks);
};

const getAllChildNodes = (data, nodeId, filteredList) => {
  data.forEach((element) => {
    if (element.parent !== undefined) {
      element.parent.forEach((parent) => {
        if (parent.id === nodeId) {
          filteredList.push(element);
          getAllChildNodes(data, element.id, filteredList);
        }
      });
    }
  });
};

const getAllLinksToNode = (links, id, filteredLinks) => {
  links.forEach((link) => {
    if (link.source === id || link.target === id) {
      filteredLinks.push(link);
    }
  });
};

const getAllLinksToNodeWithoutHidden = (links, id, filteredLinks) => {
  links.forEach((link) => {
    if (link.source === id || link.target === id) {
      filteredLinks.push(link);
    }
  });
};

const deleteNode = (id, origNodes, setOrigNodes, origLinks, setOrigLinks) => {
  const nodeData = [...origNodes];
  const linkData = [...origLinks];
  let filteredNodes = [];
  let filteredLinks = [];
  //Get All Nodes That Needs to be deleted
  getAllChildNodes(origNodes, id, filteredNodes);
  filteredNodes.push(nodeData.filter((node) => node.id === id)[0]);
  let filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

  let newData = nodeData.map((node) => {
    if (node.parent !== undefined) {
      let parent = node.parent.filter(
        (parent) => !filteredNodeIds.has(parent.id)
      );
      node.parent = parent;
      if (parent.length > 0) {
        filteredNodeIds.delete(node.id);
      }
    }
    return node;
  });

  const modifiedNodes = newData.filter(
    (node) =>
      !filteredNodeIds.has(node.id) &&
      (node.parent === undefined || node.parent.length > 0)
  );
  const nodeIds = filteredNodeIds.entries();
  for (const id of nodeIds) {
    //Get All Links connected to the nodes found
    getAllLinksToNodeWithoutHidden(linkData, id[0], filteredLinks);
  }

  let filteredLinkIds = new Set(filteredLinks.map((link) => link.id));
  const modifiedLinks = linkData.filter(
    (link) => !filteredLinkIds.has(link.id)
  );

  setOrigNodes(modifiedNodes);
  setOrigLinks(modifiedLinks);

  updateLocalStorage(modifiedNodes, modifiedLinks);
};

const toggleVisibility = (id, setOrigLinks, setOrigNodes, childHidden) => {
  let links = JSON.parse(localStorage.getItem("links"));
  let nodes = JSON.parse(localStorage.getItem("nodes"));
  let childNodes = [];
  let linkedEdges = [];
  let currentParent = nodes.filter((node) => node.id === id)[0];
  currentParent.childHidden = !currentParent.childHidden;

  getAllChildNodes(nodes, id, childNodes);

  childNodes = Object.values(
    childNodes.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
  );

  childNodes = childNodes.filter((node) => node.hidden !== childHidden);

  if (childNodes.length > 0) {
    let childNodeIds = new Set(childNodes.map((node) => node.id));
    let childNodesId = childNodeIds.entries();
    for (let id of childNodesId) {
      getAllLinksToNode(links, parseInt(id), linkedEdges);
    }

    linkedEdges = Object.values(
      linkedEdges.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
    );

    linkedEdges = linkedEdges.filter((edge) => edge.hidden === !childHidden);
    let finalNodeIds = new Set(childNodes.map((node) => node.id));
    let linkedNodesIds = new Set([
      ...linkedEdges.map((link) => link.source),
      ...linkedEdges.map((link) => link.target),
    ]);

    // check if linkedNodes that is hidden except for the finalNodeIds
    const filteredArray = Array.from(linkedNodesIds).filter(
      (value) => !Array.from(finalNodeIds).includes(value)
    );

    filteredArray.forEach((element) => {
      let node = nodes.filter((node) => node.id === element)[0];
      if (node.hidden) {
        linkedEdges = linkedEdges.filter(
          (link) => link.source !== element && link.target !== element
        );
      }
    });

    let finalLinkIds = new Set(linkedEdges.map((link) => link.id));
    nodes.forEach((node) => {
      if (finalNodeIds.has(node.id)) node.hidden = !node.hidden;
    });
    links.forEach((link) => {
      if (finalLinkIds.has(link.id)) link.hidden = !link.hidden;
    });

    setOrigLinks(links);
    setOrigNodes(nodes);

    updateLocalStorage(nodes, links);
  } else {
    return;
  }
};

const addLink = (
  linkName,
  selectedSource,
  selectedTarget,
  origNodes,
  setOrigNodes,
  origLinks,
  setOrigLinks
) => {
  let defaultName = "";
  const nextId = origLinks[origLinks.length - 1].id + 1;

  if (linkName === "") {
    const ids = origLinks.map((link) => {
      return link.id;
    });
    defaultName = `Link ${Math.max(...ids) + 1}`;
  }
  let linkObj = {
    source: selectedSource,
    target: selectedTarget,
    label: linkName !== "" ? linkName : defaultName,
    hidden: false,
    id: nextId,
  };

  let modifiedLinks = [...origLinks, linkObj];
  setOrigLinks(modifiedLinks);

  let nodes = [...origNodes];
  let sourceNode = nodes.filter((node) => node.id === selectedSource)[0];
  // add target Node id as parent if source Node is a child node
  if (sourceNode.parent !== undefined) {
    let parent = [...sourceNode.parent, { id: selectedTarget }];
    sourceNode.parent = parent;
  } else {
    //add source node id as parent if target node is a child node
    let targetNode = nodes.filter((node) => node.id === selectedTarget)[0];
    if (targetNode.parent !== undefined) {
      let parent = [...targetNode.parent, { id: selectedSource }];
      targetNode.parent = parent;
    }
  }

  setOrigNodes(nodes);

  updateLocalStorage(nodes, modifiedLinks);
};

const deleteLink = (linkId, setOrigLinks) => {
  let links = JSON.parse(localStorage.getItem("links"));
  let filteredLinks = links.filter((link) => link.id !== linkId);
  let targetedLink = links.filter((link) => link.id === linkId)[0];
  let affectedNodesIds = new Set([targetedLink.source, targetedLink.target]);

  let currentNodes = JSON.parse(localStorage.getItem("nodes"));
  let affectedNodes = currentNodes.filter((node) =>
    affectedNodesIds.has(node.id)
  );
  for (var i = 0; i < affectedNodes.length; i++) {
    let node = affectedNodes[i];
    if (node.parent !== undefined) {
      let parent = node.parent.filter(
        (parent) => !affectedNodesIds.has(parent.id)
      );
      node.parent = parent;
      if (node.parent.length === 0) {
        delete node.parent;
      }
    }
  }

  setOrigLinks(filteredLinks);

  updateLocalStorage(currentNodes, filteredLinks);
};

const getAvailableLinks = (id, links, nodes) => {
  let currentLinks = [];
  getAllLinksToNode(links, id, currentLinks, false);
  let connectedIds = new Set([
    ...currentLinks.map((link) => link.source),
    ...currentLinks.map((link) => link.target),
  ]);
  let filteredNodes = nodes.filter(
    (node) => !connectedIds.has(node.id) && !node.hidden
  );
  return filteredNodes;
};

module.exports = {
  addNode,
  deleteNode,
  addLink,
  deleteLink,
  toggleVisibility,
  getAvailableLinks,
};
