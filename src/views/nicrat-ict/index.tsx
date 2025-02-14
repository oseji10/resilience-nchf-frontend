"use client";

import React from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "North Hub" }, type: "input" },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "Subhub A" } },
  { id: "3", position: { x: 400, y: 100 }, data: { label: "Cluster 1" } },
  { id: "4", position: { x: 250, y: 200 }, data: { label: "General Hospital" } },
  
  { id: "5", position: { x: 750, y: 0 }, data: { label: "South Hub" }, type: "input" },
  { id: "6", position: { x: 600, y: 100 }, data: { label: "Subhub B" } },
  { id: "7", position: { x: 900, y: 100 }, data: { label: "Cluster 2" } },
  { id: "8", position: { x: 750, y: 200 }, data: { label: "City Hospital" } },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e5-6", source: "5", target: "6" },
  { id: "e6-7", source: "6", target: "7" },
  { id: "e7-8", source: "7", target: "8" },
];

const HospitalNetwork = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default HospitalNetwork;
