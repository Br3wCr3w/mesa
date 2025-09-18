import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Task } from '../store/tasks/tasks.models';

const STORAGE_KEY = 'mesa.tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  loadTasks(): Observable<Task[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return of([]);
      }
      const tasks = JSON.parse(data) as Task[];
      return of(tasks);
    } catch (error) {
      console.warn('Failed to parse tasks from storage', error);
      return of([]);
    }
  }

  persistTasks(tasks: Task[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to persist tasks', error);
    }
  }

  createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
