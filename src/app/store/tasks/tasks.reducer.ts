import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TasksActions } from './tasks.actions';
import { Task } from './tasks.models';

export const tasksFeatureKey = 'tasks';

export interface TasksState extends EntityState<Task> {
  loading: boolean;
  error?: string | null;
}

export const adapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const initialState: TasksState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    adapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TasksActions.addTask, (state, { task }) => adapter.addOne(task, state)),
  on(TasksActions.toggleTaskCompletion, (state, { id }) =>
    adapter.updateOne(
      {
        id,
        changes: {
          completed: !state.entities[id]?.completed,
        },
      },
      state,
    ),
  ),
  on(TasksActions.updateTaskNotes, (state, { id, notes }) =>
    adapter.updateOne(
      {
        id,
        changes: { notes },
      },
      state,
    ),
  ),
  on(TasksActions.removeTask, (state, { id }) => adapter.removeOne(id, state)),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
