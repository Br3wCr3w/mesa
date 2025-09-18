import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { NewTaskPayload, Task } from './tasks.models';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
    'Add Task': props<{ task: Task }>(),
    'Toggle Task Completion': props<{ id: string }>(),
    'Update Task Notes': props<{ id: string; notes: string }>(),
    'Remove Task': props<{ id: string }>(),
    'Create Task': props<{ payload: NewTaskPayload }>(),
  },
});
