import React, {useCallback, useState} from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {Add, PlayArrow, Save} from '@mui/icons-material';

import {NodeTemplate, Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeType} from '@/types/workflow';
import './DynamicWorkflowPage.scss';
import NodeLibrary from './NodeLibrary/NodeLibrary';
import WorkflowCanvas from './WorkflowCanvas/WorkflowCanvas';
import NodeEditor from './NodeEditor/NodeEditor';

const DynamicWorkflowPage: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [workflow, setWorkflow] = useState<Partial<Workflow>>({
    name: 'Untitled Workflow',
    description: '',
    status: 'draft',
  });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const onNodeDragStart = useCallback((event: React.DragEvent, nodeType: WorkflowNodeType, template: NodeTemplate) => {
    console.log('Drag start in page:', nodeType, template); // Debug log
    // The drag data is already set in NodeLibrary component
  }, []);

  const onNodesChange = useCallback((newNodes: WorkflowNode[]) => {
    console.log('Nodes changed in page:', newNodes.length); // Debug log
    setNodes(newNodes);

    // Update selected node if it was modified
    if (selectedNode) {
      const updatedSelectedNode = newNodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode) {
        setSelectedNode(updatedSelectedNode);
      } else {
        setSelectedNode(null);
      }
    }
  }, [selectedNode]);

  const onEdgesChange = useCallback((newEdges: WorkflowEdge[]) => {
    console.log('Edges changed in page:', newEdges.length); // Debug log
    setEdges(newEdges);
  }, []);

  const onNodeSelect = useCallback((node: WorkflowNode | null) => {
    console.log('Node selected in page:', node?.id || 'none'); // Debug log
    setSelectedNode(node);
  }, []);

  const onNodeUpdate = useCallback((updatedNode: WorkflowNode) => {
    console.log('Node updated in page:', updatedNode.id); // Debug log
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  }, []);

  const handleSaveWorkflow = () => {
    const workflowData: Workflow = {
      id: workflow.id || `workflow-${Date.now()}`,
      name: workflow.name || 'Untitled Workflow',
      description: workflow.description || '',
      nodes,
      edges,
      createdAt: workflow.createdAt || new Date(),
      updatedAt: new Date(),
      status: workflow.status || 'draft',
    };

    console.log('Saving workflow:', workflowData); // Debug log
    localStorage.setItem(`workflow-${workflowData.id}`, JSON.stringify(workflowData));

    setWorkflow(workflowData);
    setSaveDialogOpen(false);
    alert('Workflow saved successfully!');
  };

  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setWorkflow({
      name: 'Untitled Workflow',
      description: '',
      status: 'draft',
    });
  };

  const handleRunWorkflow = () => {
    // Validate workflow
    const startNodes = nodes.filter(node => node.type === 'start');
    const endNodes = nodes.filter(node => node.type === 'end');

    if (startNodes.length === 0) {
      alert('Workflow must have at least one Start node');
      return;
    }

    if (endNodes.length === 0) {
      alert('Workflow must have at least one End node');
      return;
    }

    console.log('Running workflow with nodes:', nodes, 'and edges:', edges); // Debug log
    alert(`Workflow execution started!\nNodes: ${nodes.length}\nConnections: ${edges.length}`);
  };

  // Calculate workflow stats
  const nodeStats = {
    total: nodes.length,
    start: nodes.filter(n => n.type === 'start').length,
    end: nodes.filter(n => n.type === 'end').length,
    form: nodes.filter(n => n.type === 'form').length,
    approval: nodes.filter(n => n.type === 'approval').length,
    condition: nodes.filter(n => n.type === 'condition').length,
    action: nodes.filter(n => n.type === 'action').length,
  };

  return (
    <Box className="workflow-page">
      {/* Toolbar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {workflow.name}
          </Typography>

          {/* Workflow Stats */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Chip label={`${nodeStats.total} nodes`} size="small" variant="outlined" />
            <Chip label={`${edges.length} connections`} size="small" variant="outlined" />
          </Box>

          <Button
            startIcon={<Add />}
            onClick={handleNewWorkflow}
            sx={{ mr: 1 }}
          >
            New
          </Button>
          <Button
            startIcon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            startIcon={<PlayArrow />}
            onClick={handleRunWorkflow}
            variant="contained"
            color="success"
            disabled={nodes.length === 0}
          >
            Run
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Node Library */}
          <Grid item xs={12} md={2}>
            <NodeLibrary onNodeDragStart={onNodeDragStart} />
          </Grid>

          {/* Workflow Canvas */}
          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', p: 1 }}>
                <WorkflowCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeSelect={onNodeSelect}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Node Editor */}
          <Grid item xs={12} md={3}>
            <NodeEditor
              selectedNode={selectedNode}
              onNodeUpdate={onNodeUpdate}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Workflow</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Workflow Name"
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={workflow.description}
            onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveWorkflow} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DynamicWorkflowPage;
