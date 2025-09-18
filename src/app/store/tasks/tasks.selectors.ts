import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, tasksFeatureKey, selectAll as selectAllTasksBase } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>(tasksFeatureKey);

export const selectAllTasks = createSelector(selectTasksState, selectAllTasksBase);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.loading,
);

export const selectTasksError = createSelector(selectTasksState, (state) => state.error);

export const selectPendingTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => !task.completed),
);

export const selectCompletedTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => task.completed),
);

export const selectTaskTotals = createSelector(selectTasksState, (state) => ({
  total: state.ids.length,
  completed: state.ids.reduce((count, id) => (state.entities[id]?.completed ? count + 1 : count), 0),
}));
