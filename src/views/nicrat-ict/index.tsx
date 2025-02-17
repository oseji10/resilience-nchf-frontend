"use client";

import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const HospitalNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals/network`,
           {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Error fetching hospital network:", error);
      }
    };

    fetchNetwork();
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default HospitalNetwork;
