import React, {useEffect, useState} from 'react';
import {Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography,} from '@mui/material';
import {Assignment, AutoAwesome, BugReport,} from '@mui/icons-material';

import {Board, Column, Task, User} from '@/types/backlog';
import {deserializeBoard, serializeBoard} from '@/utils/dateUtils';
import './BacklogPage.scss';
import BacklogBoard from './BacklogBoard/BacklogBoard';

// Mock data (same as before)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const currentUser: User = mockUsers[0];

const defaultColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    taskIds: [],
    color: '#757575',
  },
  {
    id: 'todo',
    title: 'To Do',
    taskIds: [],
    color: '#2196f3',
    limit: 5,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: [],
    color: '#ff9800',
    limit: 3,
  },
  {
    id: 'review',
    title: 'Review',
    taskIds: [],
    color: '#9c27b0',
    limit: 2,
  },
  {
    id: 'done',
    title: 'Done',
    taskIds: [],
    color: '#4caf50',
  },
];

const BacklogPage: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<Task['type']>('story');

  useEffect(() => {
    // Load or create default board with proper date deserialization
    try {
      const savedBoard = localStorage.getItem('kanban-board');
      if (savedBoard) {
        const parsedBoard = JSON.parse(savedBoard);
        const deserializedBoard = deserializeBoard(parsedBoard);
        setBoard(deserializedBoard);
      } else {
        createDefaultBoard();
      }
    } catch (error) {
      console.error('Error loading board from localStorage:', error);
      createDefaultBoard();
    }
  }, []);

  const createDefaultBoard = () => {
    const sampleTasks: { [key: string]: Task } = {
      'task-1': {
        id: 'task-1',
        title: 'Design user authentication flow',
        description: 'Create wireframes and mockups for the login and registration process',
        priority: 'high',
        status: 'backlog',
        assignee: mockUsers[1],
        reporter: currentUser,
        labels: ['design', 'auth'],
        storyPoints: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        comments: [],
        attachments: [],
        subtasks: [],
        type: 'story',
      },
      'task-2': {
        id: 'task-2',
        title: 'Fix login button alignment',
        description: 'The login button is not properly aligned on mobile devices',
        priority: 'medium',
        status: 'todo',
        assignee: mockUsers[2],
        reporter: currentUser,
        labels: ['bug', 'mobile'],
        storyPoints: 2,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        comments: [],
        attachments: [],
        subtasks: [],
        type: 'bug',
      },
      'task-3': {
        id: 'task-3',
        title: 'Implement API endpoints',
        description: 'Create REST API endpoints for user management',
        priority: 'high',
        status: 'in-progress',
        assignee: mockUsers[0],
        reporter: currentUser,
        labels: ['backend', 'api'],
        storyPoints: 8,
        dueDate: new Date('2024-02-15'),
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-10'),
        comments: [
          {
            id: 'comment-1',
            content: 'Started working on the user endpoints',
            author: mockUsers[0],
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10'),
          },
        ],
        attachments: [],
        subtasks: [],
        type: 'story',
      },
      'task-4': {
        id: 'task-4',
        title: 'Code review for authentication',
        description: 'Review the authentication implementation',
        priority: 'medium',
        status: 'review',
        assignee: mockUsers[3],
        reporter: currentUser,
        labels: ['review', 'auth'],
        storyPoints: 3,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12'),
        comments: [],
        attachments: [],
        subtasks: [],
        type: 'task',
      },
      'task-5': {
        id: 'task-5',
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        priority: 'low',
        status: 'done',
        assignee: mockUsers[1],
        reporter: currentUser,
        labels: ['devops', 'ci-cd'],
        storyPoints: 13,
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-08'),
        comments: [],
        attachments: [],
        subtasks: [],
        type: 'epic',
      },
    };

    const columnsWithTasks: Column[] = [
      { ...defaultColumns[0], taskIds: ['task-1'] },
      { ...defaultColumns[1], taskIds: ['task-2'] },
      { ...defaultColumns[2], taskIds: ['task-3'] },
      { ...defaultColumns[3], taskIds: ['task-4'] },
      { ...defaultColumns[4], taskIds: ['task-5'] },
    ];

    const newBoard: Board = {
      id: 'board-1',
      name: 'Project Kanban Board',
      description: 'Main project management board',
      columns: columnsWithTasks,
      tasks: sampleTasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBoard(newBoard);
    saveBoard(newBoard);
  };

  const saveBoard = (boardToSave: Board) => {
    try {
      const serializedBoard = serializeBoard(boardToSave);
      localStorage.setItem('kanban-board', JSON.stringify(serializedBoard));
    } catch (error) {
      console.error('Error saving board to localStorage:', error);
    }
  };

  const handleBoardUpdate = (updatedBoard: Board) => {
    setBoard(updatedBoard);
    saveBoard(updatedBoard);
  };

  const handleQuickCreate = (type: Task['type']) => {
    setQuickCreateType(type);
    setQuickCreateOpen(true);
  };

  const speedDialActions = [
    { icon: <Assignment />, name: 'Story', onClick: () => handleQuickCreate('story') },
    { icon: <BugReport />, name: 'Bug', onClick: () => handleQuickCreate('bug') },
    { icon: <Assignment />, name: 'Task', onClick: () => handleQuickCreate('task') },
    { icon: <AutoAwesome />, name: 'Epic', onClick: () => handleQuickCreate('epic') },
  ];

  if (!board) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className="backlog-page">
      <BacklogBoard
        board={board}
        users={mockUsers}
        currentUser={currentUser}
        onBoardUpdate={handleBoardUpdate}
      />

      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Quick create"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default BacklogPage;
