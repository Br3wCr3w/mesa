import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TasksService } from '../../services/tasks.service';
import { TasksActions } from './tasks.actions';
import { selectAllTasks } from './tasks.selectors';
import { Task } from './tasks.models';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly tasksService = inject(TasksService);

  readonly loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        this.tasksService.loadTasks().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError(() =>
            of(TasksActions.loadTasksFailure({ error: 'Unable to load tasks right now.' })),
          ),
        ),
      ),
    ),
  );

  readonly createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      map(({ payload }) => {
        const task: Task = {
          id: this.tasksService.createId(),
          title: payload.title.trim(),
          notes: payload.notes?.trim() ?? '',
          completed: false,
          createdAt: new Date().toISOString(),
        };
        return TasksActions.addTask({ task });
      }),
    ),
  );

  readonly persistTasks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TasksActions.addTask,
          TasksActions.toggleTaskCompletion,
          TasksActions.updateTaskNotes,
          TasksActions.removeTask,
        ),
        concatLatestFrom(() => this.store.select(selectAllTasks)),
        tap(([, tasks]) => this.tasksService.persistTasks(tasks)),
      ),
    { dispatch: false },
  );
}
