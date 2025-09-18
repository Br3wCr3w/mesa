import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewTaskPayload, Task } from './tasks.models';
import { TasksActions } from './tasks.actions';
import {
  selectAllTasks,
  selectCompletedTasks,
  selectPendingTasks,
  selectTaskTotals,
  selectTasksError,
  selectTasksLoading,
} from './tasks.selectors';

@Injectable({ providedIn: 'root' })
export class TasksFacade {
  readonly allTasks$: Observable<Task[]> = this.store.select(selectAllTasks);
  readonly pendingTasks$: Observable<Task[]> = this.store.select(selectPendingTasks);
  readonly completedTasks$: Observable<Task[]> = this.store.select(selectCompletedTasks);
  readonly totals$ = this.store.select(selectTaskTotals);
  readonly loading$ = this.store.select(selectTasksLoading);
  readonly error$ = this.store.select(selectTasksError);

  constructor(private readonly store: Store) {}

  loadTasks(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  createTask(payload: NewTaskPayload): void {
    this.store.dispatch(TasksActions.createTask({ payload }));
  }

  toggleCompletion(id: string): void {
    this.store.dispatch(TasksActions.toggleTaskCompletion({ id }));
  }

  updateNotes(id: string, notes: string): void {
    this.store.dispatch(TasksActions.updateTaskNotes({ id, notes }));
  }

  removeTask(id: string): void {
    this.store.dispatch(TasksActions.removeTask({ id }));
  }
}
