import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import StartNode from '../nodes/StartNode';
import EndNode from '../nodes/EndNode';
import FormNode from '../nodes/FormNode';
import ApprovalNode from '../nodes/ApprovalNode';
import ConditionNode from '../nodes/ConditionNode';
import ActionNode from '../nodes/ActionNode';

import { WorkflowNode, WorkflowEdge, NodeTemplate } from '@/types/workflow';
import './WorkflowCanvas.scss';

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  form: FormNode,
  approval: ApprovalNode,
  condition: ConditionNode,
  action: ActionNode,
};

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onEdgesChange: (edges: WorkflowEdge[]) => void;
  onNodeSelect: (node: WorkflowNode | null) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [rfNodes, setNodes, onNodesChangeInternal] = useNodesState(nodes);
  const [rfEdges, setEdges, onEdgesChangeInternal] = useEdgesState(edges);

  // Sync external nodes/edges with internal state
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('Connecting nodes:', params); // Debug log
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
      } as WorkflowEdge;

      const updatedEdges = addEdge(newEdge, rfEdges);
      setEdges(updatedEdges);
      onEdgesChange(updatedEdges);
    },
    [rfEdges, setEdges, onEdgesChange]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('Node clicked:', node); // Debug log
      onNodeSelect(node as WorkflowNode);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    console.log('Pane clicked'); // Debug log
    onNodeSelect(null);
  }, [onNodeSelect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      console.log('Drop event triggered'); // Debug log

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const templateData = event.dataTransfer.getData('application/reactflow');

      console.log('Template data:', templateData); // Debug log
      console.log('React Flow bounds:', reactFlowBounds); // Debug log
      console.log('React Flow instance:', reactFlowInstance); // Debug log

      if (templateData && reactFlowBounds && reactFlowInstance) {
        try {
          const template: NodeTemplate = JSON.parse(templateData);
          console.log('Parsed template:', template); // Debug log

          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          console.log('Calculated position:', position); // Debug log

          const newNode: WorkflowNode = {
            id: `${template.type}-${Date.now()}`,
            type: template.type,
            position,
            data: { ...template.defaultData },
          };

          console.log('New node created:', newNode); // Debug log

          const updatedNodes = [...rfNodes, newNode];
          setNodes(updatedNodes);
          onNodesChange(updatedNodes);

          console.log('Nodes updated, total count:', updatedNodes.length); // Debug log
        } catch (error) {
          console.error('Error parsing template data:', error);
        }
      } else {
        console.log('Missing required data for drop:', {
          templateData: !!templateData,
          reactFlowBounds: !!reactFlowBounds,
          reactFlowInstance: !!reactFlowInstance
        });
      }
    },
    [reactFlowInstance, rfNodes, setNodes, onNodesChange]
  );

  const onNodesChangeHandler = useCallback(
    (changes: any) => {
      console.log('Nodes change:', changes); // Debug log
      onNodesChangeInternal(changes);
      // Use setTimeout to get the updated state
      setTimeout(() => {
        setNodes(currentNodes => {
          onNodesChange(currentNodes);
          return currentNodes;
        });
      }, 0);
    },
    [onNodesChangeInternal, onNodesChange, setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes: any) => {
      console.log('Edges change:', changes); // Debug log
      onEdgesChangeInternal(changes);
      // Use setTimeout to get the updated state
      setTimeout(() => {
        setEdges(currentEdges => {
          onEdgesChange(currentEdges);
          return currentEdges;
        });
      }, 0);
    },
    [onEdgesChangeInternal, onEdgesChange, setEdges]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    console.log('ReactFlow initialized:', instance); // Debug log
    setReactFlowInstance(instance);
  }, []);

  return (
    <div className="workflow-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const WorkflowCanvasWrapper: React.FC<WorkflowCanvasProps> = (props) => (
  <ReactFlowProvider>
    <WorkflowCanvas {...props} />
  </ReactFlowProvider>
);

export default WorkflowCanvasWrapper;
