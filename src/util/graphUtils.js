const updateLocalStorage = (nodes, links) => {
  if (nodes !== null) localStorage.setItem("nodes", JSON.stringify(nodes));
  if (links !== null) localStorage.setItem("links", JSON.stringify(links));
};

const addNode = (nodeName, origNodes, setOrigNodes) => {
  const nextId = origNodes[origNodes.length - 1].id + 1;
  let defaultName = "";
  if (nodeName === "") {
    const ids = origNodes.map((node) => {
      return node.parent === undefined && node.id;
    });
    defaultName = `Node ${Math.max(...ids) + 1}`;
  }
  let nodeObj = {
    id: nextId,
    label: nodeName !== "" ? nodeName : defaultName,
    color: "black",
    font: {
      color: "white",
    },
    hidden: false,
  };
  let modifiedNodes = [...origNodes, nodeObj];
  setOrigNodes(modifiedNodes);
  updateLocalStorage(modifiedNodes, null);
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

  if (childNodes.length > 0) {
    let childNodeIds = new Set(childNodes.map((node) => node.id));
    getAllLinksToNode(links, id, linkedEdges);
    let childNodesId = childNodeIds.entries();
    for (let id of childNodesId) {
      getAllLinksToNode(links, parseInt(id), linkedEdges);
    }

    linkedEdges = Object.values(
      linkedEdges.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
    );

    let linkedNodes = new Set([
      ...linkedEdges.map((link) => link.source),
      ...linkedEdges.map((link) => link.target),
    ]);

    //delete click node id
    linkedNodes.delete(id);

    nodes.forEach((element) => {
      if (linkedNodes.has(element.id)) {
        let elementId = parseInt(element.id);
        //delete linked nodes that are parent

        if (element.parent === undefined) {
          linkedEdges = linkedEdges.filter(
            (link) => link.source !== elementId && link.target !== elementId
          );
          linkedNodes.delete(element.id);
        } else {
          //if linked nodes has multiple parents
          if (element.parent.length > 1) {
            let parents = [];
            for (let parent of element.parent) {
              if (parent.id !== id) {
                parents.push(nodes.filter((node) => node.id === parent.id)[0]);
              }
            }
            let everyChildHidden = parents.every(
              (node) => node.childHidden === childHidden
            );
            if (!everyChildHidden) {
              for (let node of parents) {
                linkedEdges = linkedEdges.filter(
                  (link) => link.source !== node.id && link.target !== node.id
                );
                linkedNodes.delete(node.id);
                let childParentNodes = [];
                getAllChildNodes(nodes, node.id, childParentNodes);

                childParentNodes = Object.values(
                  childParentNodes.reduce(
                    (acc, obj) => ({ ...acc, [obj.id]: obj }),
                    {}
                  )
                );
                if (childParentNodes.length > 0) {
                  let ids = new Set(childParentNodes.map((node) => node.id));
                  childNodes = childNodes.filter((node) => !ids.has(node.id));
                  linkedEdges = linkedEdges.filter(
                    (link) => !ids.has(link.source) && !ids.has(link.target)
                  );
                }
              }
            } else {
              for (let node of parents) {
                let childParentNodes = [];
                getAllChildNodes(nodes, node.id, childParentNodes);
                childParentNodes = Object.values(
                  childParentNodes.reduce(
                    (acc, obj) => ({ ...acc, [obj.id]: obj }),
                    {}
                  )
                );

                if (childParentNodes.length > 0) {
                  childParentNodes.forEach((element) => {
                    if (element.parent !== undefined) {
                      let parents = element.parent;
                      parents.filter(
                        (item) => item.id !== id && item.id !== node.id
                      );
                      if (parents.length > 0) {
                        console.table(parents);
                        console.table(linkedEdges);
                        console.table(childNodes);
                        parents.forEach((item) => {
                          linkedEdges.forEach((link) => {
                            if (item === link.source || item === link.target) {
                              link.hidden = childHidden;
                            }
                          });
                          childNodes.forEach((node) => {
                            if (item === node.id) {
                              node.childHidden = childHidden;
                            }
                          });
                        });
                      }
                    }
                  });
                }
              }
            }
          }
        }
      }
    });

    childNodes = childNodes.filter((node) => node.hidden !== childHidden);
    let finalNodeIds = new Set(childNodes.map((node) => node.id));
    linkedEdges = linkedEdges.filter((link) => link.hidden !== childHidden);
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
    (node) => !connectedIds.has(node.id) && node.parent === undefined
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
