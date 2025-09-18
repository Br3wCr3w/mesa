import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concat, of } from 'rxjs';
import { catchError, delay, filter, map, switchMap } from 'rxjs/operators';
import { TableService } from '../../services/table.service';
import { TableActions } from './table.actions';
import { selectPlayerById } from './table.selectors';

@Injectable()
export class TableEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly tableService = inject(TableService);

  readonly enterTable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableActions.enterTable),
      switchMap(() =>
        this.tableService.loadSnapshot().pipe(
          map((snapshot) => TableActions.enterTableSuccess({ snapshot })),
          catchError(() =>
            of(
              TableActions.enterTableFailure({
                error: 'We could not connect to the table right now. Try again soon.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly sendChatMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableActions.sendChatMessage),
      map((action) => ({ ...action, content: action.content.trim() })),
      filter(({ content }) => content.length > 0),
      concatLatestFrom(({ authorId }) => this.store.select(selectPlayerById(authorId))),
      switchMap(([action, player]) => {
        const message = this.tableService.createPlayerMessage(action.authorId, action.content);
        if (!player) {
          return of(TableActions.messageReceived({ message }));
        }
        return concat(
          of(TableActions.setPlayerSpeaking({ playerId: action.authorId, speaking: true })),
          of(TableActions.messageReceived({ message })),
          of(TableActions.setPlayerSpeaking({ playerId: action.authorId, speaking: false })).pipe(
            delay(800),
          ),
        );
      }),
    ),
  );

  readonly requestAiGuidance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TableActions.requestAiGuidance),
      map((action) => action.prompt.trim()),
      filter((prompt) => prompt.length > 0),
      switchMap((prompt) =>
        concat(
          of(TableActions.aiGuidancePending()),
          this.tableService.requestAiGuidance(prompt).pipe(
            map((response) =>
              TableActions.aiGuidanceReceived({
                message: response.message,
                suggestion: response.suggestion,
              }),
            ),
            catchError(() =>
              of(
                TableActions.aiGuidanceReceived({
                  message: this.tableService.createAiMessage(
                    'I lost connection for a moment. Please try the request again.',
                  ),
                  suggestion:
                    'Connection hiccup detected. Check your network if the issue persists.',
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
