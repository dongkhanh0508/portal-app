export const serializeDate = (date: Date | undefined): string | undefined => {
  return date ? date.toISOString() : undefined;
};

export const deserializeDate = (dateString: string | undefined): Date | undefined => {
  return dateString ? new Date(dateString) : undefined;
};

export const serializeTask = (task: any): any => {
  return {
    ...task,
    dueDate: serializeDate(task.dueDate),
    createdAt: serializeDate(task.createdAt),
    updatedAt: serializeDate(task.updatedAt),
    comments: task.comments?.map((comment: any) => ({
      ...comment,
      createdAt: serializeDate(comment.createdAt),
      updatedAt: serializeDate(comment.updatedAt),
    })) || [],
    attachments: task.attachments?.map((attachment: any) => ({
      ...attachment,
      uploadedAt: serializeDate(attachment.uploadedAt),
    })) || [],
    subtasks: task.subtasks?.map((subtask: any) => ({
      ...subtask,
      createdAt: serializeDate(subtask.createdAt),
    })) || [],
  };
};

export const deserializeTask = (task: any): any => {
  return {
    ...task,
    dueDate: deserializeDate(task.dueDate),
    createdAt: deserializeDate(task.createdAt),
    updatedAt: deserializeDate(task.updatedAt),
    comments: task.comments?.map((comment: any) => ({
      ...comment,
      createdAt: deserializeDate(comment.createdAt),
      updatedAt: deserializeDate(comment.updatedAt),
    })) || [],
    attachments: task.attachments?.map((attachment: any) => ({
      ...attachment,
      uploadedAt: deserializeDate(attachment.uploadedAt),
    })) || [],
    subtasks: task.subtasks?.map((subtask: any) => ({
      ...subtask,
      createdAt: deserializeDate(subtask.createdAt),
    })) || [],
  };
};

export const serializeBoard = (board: any): any => {
  return {
    ...board,
    createdAt: serializeDate(board.createdAt),
    updatedAt: serializeDate(board.updatedAt),
    tasks: Object.keys(board.tasks).reduce((acc: any, taskId: string) => {
      acc[taskId] = serializeTask(board.tasks[taskId]);
      return acc;
    }, {}),
  };
};

export const deserializeBoard = (board: any): any => {
  return {
    ...board,
    createdAt: deserializeDate(board.createdAt),
    updatedAt: deserializeDate(board.updatedAt),
    tasks: Object.keys(board.tasks).reduce((acc: any, taskId: string) => {
      acc[taskId] = deserializeTask(board.tasks[taskId]);
      return acc;
    }, {}),
  };
};
