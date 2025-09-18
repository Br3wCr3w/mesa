import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableActions } from './table.actions';
import {
  selectAiAssistantState,
  selectChatMessages,
  selectOnlinePlayers,
  selectSceneDetails,
  selectTableViewModel,
} from './table.selectors';

@Injectable({ providedIn: 'root' })
export class TableFacade {
  readonly viewModel$ = this.store.select(selectTableViewModel);
  readonly players$ = this.store.select(selectOnlinePlayers);
  readonly messages$ = this.store.select(selectChatMessages);
  readonly scene$ = this.store.select(selectSceneDetails);
  readonly aiAssistant$ = this.store.select(selectAiAssistantState);

  constructor(private readonly store: Store) {}

  enterTable(): void {
    this.store.dispatch(TableActions.enterTable());
  }

  sendChatMessage(authorId: string, content: string): void {
    this.store.dispatch(TableActions.sendChatMessage({ authorId, content }));
  }

  togglePlayerAudio(playerId: string): void {
    this.store.dispatch(TableActions.togglePlayerAudio({ playerId }));
  }

  setPlayerSpeaking(playerId: string, speaking: boolean): void {
    this.store.dispatch(TableActions.setPlayerSpeaking({ playerId, speaking }));
  }

  requestAiGuidance(prompt: string): void {
    this.store.dispatch(TableActions.requestAiGuidance({ prompt }));
  }
}
