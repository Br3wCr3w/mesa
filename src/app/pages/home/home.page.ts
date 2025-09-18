import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TasksFacade } from '../../store/tasks/tasks.facade';
import { Task } from '../../store/tasks/tasks.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  readonly totals$ = this.tasksFacade.totals$;
  readonly pendingTasks$: Observable<Task[]> = this.tasksFacade.pendingTasks$;
  readonly completedTasks$: Observable<Task[]> = this.tasksFacade.completedTasks$;
  readonly loading$ = this.tasksFacade.loading$;
  readonly error$ = this.tasksFacade.error$;

  readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    notes: [''],
  });

  readonly trackByTaskId: TrackByFunction<Task> = (_, item) => item.id;

  constructor(
    private readonly tasksFacade: TasksFacade,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.tasksFacade.loadTasks();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.tasksFacade.createTask({
      title: this.taskForm.controls.title.value,
      notes: this.taskForm.controls.notes.value,
    });

    this.taskForm.reset({ title: '', notes: '' });
  }

  toggleCompletion(task: Task): void {
    this.tasksFacade.toggleCompletion(task.id);
  }

  updateNotes(task: Task, value: string | null | undefined): void {
    this.tasksFacade.updateNotes(task.id, value?.trim() ?? '');
  }

  removeTask(task: Task): void {
    this.tasksFacade.removeTask(task.id);
  }
}
