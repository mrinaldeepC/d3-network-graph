import React, { useEffect, useRef, useState } from "react";
import useResizeObserver from "../customHooks/useResizeObserver";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  path,
  select,
} from "d3";
import { toggleVisibility } from "../util/graphUtils";

const NetworkGraph = ({
  nodes,
  links,
  setNodes,
  setLinks,
  setDeleteModalOpen,
}) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const toggle = (id, visible) => {
    toggleVisibility(id, setLinks, setNodes, !visible);
  };

  const createGraph = () => {
    if (!dimensions) return;

    const filteredLinks = links.filter((item) => item.hidden !== true);
    const filteredNodes = nodes.filter((item) => item.hidden !== true);

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const simulation = forceSimulation(filteredNodes)
      .force(
        "link",
        forceLink(filteredLinks)
          .id((node) => node.id)
          .distance(200)
      )
      .force("charge", forceManyBody().strength(-100))
      .force("center", forceCenter(dimensions.width / 2, dimensions.height / 2))
      .on("tick", () => {
        // Create links
        svg
          .selectAll(".link")
          .data(filteredLinks)
          .join("line")
          .attr("class", "link")
          .attr("stroke", (link) => link.source.color)
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("x1", (link) => link.source.x)
          .attr("y1", (link) => link.source.y)
          .attr("x2", (link) => link.target.x)
          .attr("y2", (link) => link.target.y);

        //Create Link labels
        svg
          .selectAll(".link-label")
          .data(filteredLinks)
          .join("text")
          .attr("class", "link-label")
          .attr("font-size", (link) => (link?.label !== undefined ? 10 : 0))
          .attr("fill", "black")
          .text((link) => (link?.label !== undefined ? link.label : ""))
          .attr("x", (link) => {
            if (link.target.x > link.source.x) {
              return link.source.x + (link.target.x - link.source.x) / 2 - 10;
            } else {
              return link.target.x + (link.source.x - link.target.x) / 2 - 10;
            }
          })
          .attr("y", (link) => {
            if (link.target.y > link.source.y) {
              return link.source.y + (link.target.y - link.source.y) / 2;
            } else {
              return link.target.y + (link.source.y - link.target.y) / 2;
            }
          })
          .attr("dy", ".35em");

        //Create Nodes
        svg
          .selectAll(".node")
          .data(filteredNodes)
          .join("circle")
          .attr("class", "node")
          .attr("r", (node) => (node?.parent !== undefined ? 15 : 20))
          .attr("fill", (node) => node.color)
          .attr("cx", (node) => node.x)
          .attr("cy", (node) => node.y)
          .on("mouseenter", function (node) {
            select(this).style("cursor", "pointer");
          })
          .on("click", function (node) {
            toggle(
              parseInt(node.target.__data__.id),
              node.target.__data__.childHidden
            );
          });

        //Create Node labels
        svg
          .selectAll(".node-label")
          .data(filteredNodes)
          .join("text")
          .attr("class", "node-label")
          .attr("text-anchor", "middle")
          .attr("font-size", (node) => (node?.parent !== undefined ? 8 : 10))
          .attr("fill", (node) =>
            node?.font !== undefined ? node.font.color : "black"
          )
          .text((node) => node.label)
          .attr("x", (node) => node.x)
          .attr("y", (node) => node.y)
          .on("mouseenter", function (node) {
            select(this).style("cursor", "pointer");
          })
          .on("click", function (node) {
            toggle(
              parseInt(node.target.__data__.id),
              node.target.__data__.childHidden
            );
          });
      });
  };

  useEffect(() => {
    createGraph();
  }, [nodes, links, dimensions]);
  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default NetworkGraph;
